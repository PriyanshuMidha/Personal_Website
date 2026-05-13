import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import SectionHeader from "../components/SectionHeader";
import DataTable from "../components/DataTable";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import useToast from "../hooks/useToast";
import { invalidateCache } from "../utils/apiCache";

const PAGE_SIZE = 20;

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

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, pages: 1 });
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const toast = useToast();

  const loadMessages = async ({ nextPage = pagination.page, nextStatus = statusFilter } = {}) => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.listResource("/admin/messages", {
        page: nextPage,
        limit: PAGE_SIZE,
        status: nextStatus,
      });
      setMessages(response.data.items || []);
      setPagination(response.data.pagination || { page: nextPage, limit: PAGE_SIZE, total: 0, pages: 1 });
    } catch (loadError) {
      setError(loadError.message || "Unable to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages({ nextPage: 1, nextStatus: "" });
  }, []);

  if (loading) return <Loader label="Loading inbox..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Inbox"
        title="Contact messages"
        description="Review recent outreach, update response status, and keep the conversation queue clean."
      />

      <div className="card-surface flex flex-wrap items-end gap-3 p-4">
        <label className="grid gap-2 text-sm text-text-secondary">
          <span>Status</span>
          <select
            value={statusFilter}
            onChange={(event) => {
              const nextStatus = event.target.value;
              setStatusFilter(nextStatus);
              setPagination((current) => ({ ...current, page: 1 }));
              loadMessages({ nextPage: 1, nextStatus });
            }}
            className="rounded-full border border-border-soft bg-card px-4 py-2 text-sm text-text-primary"
          >
            <option value="" className="bg-night">
              All statuses
            </option>
            {["new", "read", "replied", "archived"].map((status) => (
              <option key={status} value={status} className="bg-night">
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <DataTable
        columns={[
          {
            key: "name",
            label: "Sender",
            render: (_value, row) => (
              <div>
                <p className="font-medium text-text-primary">{row.name}</p>
                <p className="mt-1 text-xs text-text-muted">{row.email}</p>
              </div>
            ),
          },
          { key: "subject", label: "Subject" },
          { key: "status", label: "Status", render: (value) => <StatusBadge status={value} /> },
          { key: "createdAt", label: "Received", render: (value) => new Date(value).toLocaleDateString() },
        ]}
        rows={messages}
        emptyTitle="No contact messages yet"
        emptyDescription="Public form submissions will surface here once messages arrive."
        actions={(row) => (
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={row.status}
              onChange={async (event) => {
                try {
                  const response = await adminApi.updateMessageStatus(row._id, event.target.value);
                  const updatedMessage = response.data;
                  setMessages((currentMessages) => currentMessages.map((message) => (message._id === updatedMessage._id ? updatedMessage : message)));
                  invalidateCache("admin:dashboard:overview");
                  toast.success("Message status updated successfully.");
                } catch (updateError) {
                  toast.error(updateError.message || "Unable to update message status");
                }
              }}
              className="rounded-full border border-border-soft bg-card px-3 py-1 text-xs text-text-secondary"
            >
              {["new", "read", "replied", "archived"].map((status) => (
                <option key={status} value={status} className="bg-night">
                  {status}
                </option>
              ))}
            </select>
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
          loadMessages({ nextPage });
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete message?"
        description="This will remove the message from the inbox."
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          try {
            const currentDelete = pendingDelete;
            await adminApi.deleteMessage(currentDelete._id);
            setMessages((currentMessages) => currentMessages.filter((message) => message._id !== currentDelete._id));
            setPagination((current) => {
              const nextTotal = Math.max(0, current.total - 1);
              return {
                ...current,
                total: nextTotal,
                pages: Math.max(1, Math.ceil(nextTotal / current.limit)),
              };
            });
            setPendingDelete(null);
            invalidateCache("admin:dashboard:overview");
            toast.success("Message deleted successfully.");
          } catch (deleteError) {
            toast.error(deleteError.message || "Unable to delete message");
          }
        }}
      />
    </div>
  );
};

export default MessagesPage;
