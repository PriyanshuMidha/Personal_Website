import EmptyState from "./EmptyState";

const DataTable = ({ columns, rows, actions, emptyTitle, emptyDescription, dense = false }) => {
  if (!rows.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="card-surface overflow-hidden">
      <div className="scrollbar-subtle overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="border-b border-border bg-panel">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
                  {column.label}
                </th>
              ))}
              {actions ? <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row._id || index} className="border-b border-border/80 last:border-b-0 hover:bg-white/[0.02]">
                {columns.map((column) => (
                  <td key={column.key} className={`${dense ? "px-5 py-3" : "px-5 py-4"} text-sm text-text-secondary`}>
                    {column.render ? column.render(row[column.key], row) : row[column.key] ?? "-"}
                  </td>
                ))}
                {actions ? <td className={`${dense ? "px-5 py-3" : "px-5 py-4"} text-sm text-text-secondary`}>{actions(row)}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
