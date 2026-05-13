import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../api/adminApi";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import FormTextarea from "../components/FormTextarea";
import FormArrayInput from "../components/FormArrayInput";
import ImageUploader from "../components/ImageUploader";
import SectionHeader from "../components/SectionHeader";
import DataTable from "../components/DataTable";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import useToast from "../hooks/useToast";
import { invalidateCache } from "../utils/apiCache";
import { buildResourceInitialState, normalizeResourcePayload, validateResourcePayload } from "../utils/cms";

const formatSaveError = (error) => {
  if (error?.errors?.length) {
    return error.errors.map((entry) => `${entry.field}: ${entry.message}`).join(" | ");
  }

  return error?.message || "Save failed";
};

const normalizeDateValue = (value) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

const getInvalidatePrefixes = (endpoint) => {
  switch (endpoint) {
    case "/admin/projects":
      return ["admin:dashboard:overview", "public:home", "public:projects", "public:featured-projects"];
    case "/admin/skills":
      return ["admin:dashboard:overview", "public:home", "public:skills"];
    case "/admin/experience":
      return ["admin:dashboard:overview", "public:home", "public:experience"];
    case "/admin/achievements":
      return ["admin:dashboard:overview", "public:home", "public:achievements"];
    case "/admin/education":
      return ["public:education"];
    default:
      return [];
  }
};

const buildCreateState = (currentRows, item, pageSize, page) => {
  if (page !== 1) {
    return currentRows;
  }

  return [item, ...currentRows].slice(0, pageSize);
};

const PaginationBar = ({ page, pages, total, onPageChange }) => {
  if (!total) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-border bg-card px-4 py-3 text-sm text-text-secondary">
      <p>
        Page {page} of {pages || 1} · {total} total
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-full border border-border-soft px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-full border border-border-soft px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const ResourceManagerPage = ({ config }) => {
  const initialState = useMemo(() => buildResourceInitialState(config), [config]);
  const pageSize = config.pageSize || 10;
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: pageSize, total: 0, pages: 1 });
  const [filters, setFilters] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialState);
  const [pendingDelete, setPendingDelete] = useState(null);
  const toast = useToast();

  const load = async ({ nextPage = pagination.page, nextSearch = search, nextFilters = filters } = {}) => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.listResource(config.endpoint, {
        page: nextPage,
        limit: pageSize,
        search: nextSearch,
        ...nextFilters,
      });
      setRows(response.data.items || []);
      setPagination(response.data.pagination || { page: nextPage, limit: pageSize, total: 0, pages: 1 });
    } catch (loadError) {
      setError(loadError.message || `Unable to load ${config.title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm(initialState);
  }, [initialState]);

  useEffect(() => {
    setFilters({});
    setSearch("");
    setSearchInput("");
    setPagination((current) => ({ ...current, page: 1, limit: pageSize }));
    load({ nextPage: 1, nextSearch: "", nextFilters: {} });
  }, [config.endpoint, pageSize]);

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleEdit = (row) => {
    const normalized = normalizeResourcePayload({ ...initialState, ...row }, config);
    config.fields
      .filter((field) => field.type === "date")
      .forEach((field) => {
        normalized[field.name] = normalizeDateValue(row[field.name]);
      });

    setEditingItem(row);
    setForm({ ...initialState, ...normalized });
  };

  const resetEditor = () => {
    setEditingItem(null);
    setSaveError("");
    setForm(initialState);
  };

  const invalidateAffectedCaches = () => {
    invalidateCache(getInvalidatePrefixes(config.endpoint));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaveError("");
    const payload = normalizeResourcePayload(form, config);
    const validationErrors = validateResourcePayload(payload, config);

    if (validationErrors.length) {
      const message = validationErrors.join(" | ");
      setSaveError(message);
      toast.error(message);
      return;
    }

    setSaving(true);

    try {
      if (editingItem?._id) {
        const response = await adminApi.updateResource(config.endpoint, editingItem._id, payload);
        const savedItem = response.data;
        setRows((currentRows) => currentRows.map((row) => (row._id === savedItem._id ? savedItem : row)));
        toast.success(`${config.singularLabel || config.title.slice(0, -1)} updated successfully.`);
      } else {
        const response = await adminApi.createResource(config.endpoint, payload);
        const savedItem = response.data;
        setRows((currentRows) => buildCreateState(currentRows, savedItem, pageSize, pagination.page));
        setPagination((current) => ({
          ...current,
          total: current.total + 1,
          pages: Math.max(1, Math.ceil((current.total + 1) / current.limit)),
        }));
        toast.success(`${config.singularLabel || config.title.slice(0, -1)} created successfully.`);
      }

      invalidateAffectedCaches();
      resetEditor();
    } catch (err) {
      const message = formatSaveError(err);
      setSaveError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const columns = config.fields.slice(0, 4).map((field) => ({
    key: field.name,
    label: field.label,
    render: (value, row) => {
      if (field.name === "isPublished") return <StatusBadge status={value ? "published" : "draft"} />;
      if (field.name === "isFeatured") return value ? <StatusBadge tone="primary">Featured</StatusBadge> : <span className="text-text-muted">No</span>;
      if (Array.isArray(value)) return value.join(", ");
      if (typeof value === "boolean") return value ? "Yes" : "No";
      if (field.type === "date" && value) return new Date(value).toLocaleDateString();
      if (field.name === "title" || field.name === "company" || field.name === "degree" || field.name === "name") {
        return (
          <div>
            <p className="font-medium text-text-primary">{value}</p>
            {row.category ? <p className="mt-1 text-xs text-text-muted">{row.category}</p> : null}
          </div>
        );
      }
      return value || "-";
    },
  }));

  if (loading) return <Loader label={`Loading ${config.title.toLowerCase()}...`} />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="CMS Manager"
        title={config.title}
        description={`Create, publish, and reorder ${config.title.toLowerCase()} from the control room without changing the underlying API contracts.`}
      />

      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <section className="space-y-4">
          <div className="card-surface flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-sm">
              <FormInput label="Search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
            </div>
            <div className="flex flex-wrap items-end gap-3">
              {(config.listFilters || []).map((filter) => (
                <label key={filter.name} className="grid gap-2 text-sm text-text-secondary">
                  <span>{filter.label}</span>
                  <select
                    value={filters[filter.name] || ""}
                    onChange={(event) => {
                      const nextFilters = { ...filters, [filter.name]: event.target.value };
                      setFilters(nextFilters);
                      setPagination((current) => ({ ...current, page: 1 }));
                      load({ nextPage: 1, nextSearch: search, nextFilters });
                    }}
                    className="rounded-full border border-border-soft bg-card px-4 py-2 text-sm text-text-primary"
                  >
                    {filter.options.map((option) => (
                      <option key={option || "all"} value={option} className="bg-night">
                        {option || `All ${filter.label}`}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
              <button
                type="button"
                onClick={() => {
                  setSearch(searchInput.trim());
                  setPagination((current) => ({ ...current, page: 1 }));
                  load({ nextPage: 1, nextSearch: searchInput.trim(), nextFilters: filters });
                }}
                className="rounded-full border border-border-soft px-5 py-3 text-sm text-text-secondary"
              >
                Apply
              </button>
            </div>
          </div>

          {rows.length ? (
            <>
              <DataTable
                columns={columns}
                rows={rows}
                emptyTitle={`No ${config.title.toLowerCase()} yet`}
                emptyDescription={`Create your first ${config.title.slice(0, -1).toLowerCase()} using the editor panel.`}
                actions={(row) => (
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="button" onClick={() => handleEdit(row)} className="text-accent-primary hover:text-text-primary">
                      Edit
                    </button>
                    <button type="button" onClick={() => setPendingDelete(row)} className="text-red-300 hover:text-text-primary">
                      Delete
                    </button>
                  </div>
                )}
              />
              <PaginationBar
                page={pagination.page}
                pages={pagination.pages}
                total={pagination.total}
                onPageChange={(nextPage) => {
                  setPagination((current) => ({ ...current, page: nextPage }));
                  load({ nextPage });
                }}
              />
            </>
          ) : (
            <EmptyState
              title={`No ${config.title.toLowerCase()} yet`}
              description={search || Object.values(filters).some(Boolean) ? "Try adjusting the current filters or search term." : `Create your first ${config.title.slice(0, -1).toLowerCase()} using the editor panel.`}
            />
          )}
        </section>

        <form onSubmit={handleSubmit} className="shell space-y-5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label">Editor</p>
              <h3 className="mt-2 font-display text-2xl text-text-primary">
                {editingItem ? `Edit ${config.title.slice(0, -1)}` : `Create ${config.title.slice(0, -1)}`}
              </h3>
            </div>
            <button
              type="button"
              onClick={resetEditor}
              className="rounded-full border border-border-soft px-4 py-2 text-sm text-text-secondary"
            >
              Reset
            </button>
          </div>

          {config.fields.map((field) => {
            if (field.type === "textarea") {
              return <FormTextarea key={field.name} label={field.label} value={form[field.name] || ""} onChange={(event) => setField(field.name, event.target.value)} />;
            }

            if (field.type === "array") {
              return <FormArrayInput key={field.name} label={field.label} value={form[field.name] || []} onChange={(value) => setField(field.name, value)} />;
            }

            if (field.type === "checkbox") {
              return (
                <label key={field.name} className="flex items-center gap-3 text-sm text-text-secondary">
                  <input type="checkbox" checked={Boolean(form[field.name])} onChange={(event) => setField(field.name, event.target.checked)} />
                  {field.label}
                </label>
              );
            }

            if (field.type === "select") {
              return (
                <FormSelect
                  key={field.name}
                  label={field.label}
                  value={form[field.name] ?? ""}
                  options={field.options || []}
                  onChange={(event) => setField(field.name, event.target.value)}
                />
              );
            }

            return (
              <FormInput
                key={field.name}
                type={field.type === "date" ? "date" : field.type}
                label={field.label}
                required={field.required}
                min={field.type === "number" ? 0 : undefined}
                value={form[field.name] ?? ""}
                onChange={(event) => setField(field.name, event.target.value)}
              />
            );
          })}

          {config.endpoint === "/admin/projects" ? (
            <>
              <ImageUploader label="Upload project screenshot" onUploaded={(asset) => setField("screenshots", [...(form.screenshots || []), asset])} />
              {(form.screenshots || []).length ? (
                <div className="space-y-3">
                  {(form.screenshots || []).map((asset, index) => (
                    <div key={`${asset.url}-${index}`} className="card-surface flex items-center justify-between gap-3 px-4 py-3 text-sm">
                      <span className="truncate text-text-secondary">{asset.originalName || asset.url}</span>
                      <button type="button" onClick={() => setField("screenshots", form.screenshots.filter((_, assetIndex) => assetIndex !== index))} className="text-red-300">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}

          {saveError ? <p className="text-sm text-red-300">{saveError}</p> : null}

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={saving} className="rounded-full bg-accent-primary px-6 py-3 font-semibold text-white disabled:opacity-60">
              {saving ? (editingItem ? "Updating..." : "Creating...") : editingItem ? "Update entry" : "Create entry"}
            </button>
            {config.publicPath ? (
              <a
                href={config.publicPath}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border-soft px-5 py-3 text-sm text-text-secondary hover:text-text-primary"
              >
                View public page
              </a>
            ) : null}
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${config.title.slice(0, -1)}?`}
        description="This removes the selected item from the CMS."
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          try {
            const currentDelete = pendingDelete;
            await adminApi.deleteResource(config.endpoint, currentDelete._id);
            setRows((currentRows) => currentRows.filter((row) => row._id !== currentDelete._id));
            setPagination((current) => {
              const nextTotal = Math.max(0, current.total - 1);
              return {
                ...current,
                total: nextTotal,
                pages: Math.max(1, Math.ceil(nextTotal / current.limit)),
              };
            });
            setPendingDelete(null);
            invalidateAffectedCaches();
            toast.success(`${config.singularLabel || config.title.slice(0, -1)} deleted successfully.`);
          } catch (deleteError) {
            const message = formatSaveError(deleteError);
            setSaveError(message);
            toast.error(message);
          }
        }}
      />
    </div>
  );
};

export default ResourceManagerPage;
