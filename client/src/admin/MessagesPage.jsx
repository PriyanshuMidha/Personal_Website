import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import SectionHeader from "../components/SectionHeader";
import DataTable from "../components/DataTable";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import useToast from "../hooks/useToast";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const toast = useToast();

  const loadMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.listResource("/admin/messages");
      setMessages(response.data || []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
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
              defaultValue={row.status}
              onChange={async (event) => {
                try {
                  await adminApi.updateMessageStatus(row._id, event.target.value);
                  await loadMessages();
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

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete message?"
        description="This will remove the message from the inbox."
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          try {
            await adminApi.deleteMessage(pendingDelete._id);
            setPendingDelete(null);
            await loadMessages();
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
