import DataTable from "./DataTable";

const AdminTable = ({ columns, rows, onEdit, onDelete, extraActions }) => (
  <DataTable
    columns={columns}
    rows={rows}
    actions={(row) => (
      <div className="flex flex-wrap items-center gap-3">
        {onEdit ? (
          <button type="button" onClick={() => onEdit(row)} className="text-accent-primary hover:text-text-primary">
            Edit
          </button>
        ) : null}
        {extraActions ? extraActions(row) : null}
        {onDelete ? (
          <button type="button" onClick={() => onDelete(row)} className="text-red-300 hover:text-text-primary">
            Delete
          </button>
        ) : null}
      </div>
    )}
  />
);

export default AdminTable;
