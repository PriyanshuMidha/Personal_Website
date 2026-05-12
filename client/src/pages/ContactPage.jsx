import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import FormInput from "../components/FormInput";
import FormTextarea from "../components/FormTextarea";
import { publicApi } from "../api/publicApi";
import StatusBadge from "../components/StatusBadge";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ loading: false, success: "", error: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, success: "", error: "" });

    try {
      await publicApi.submitContact(form);
      setStatus({ loading: false, success: "Message sent successfully.", error: "" });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({ loading: false, success: "", error: error.message || "Unable to send message." });
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <div className="space-y-6">
        <SectionHeader title="Contact" description="Use the dashboard-style contact panel to start a conversation about backend systems, products, or engineering work." eyebrow="Reach Out" />
        <div className="shell space-y-4 p-6">
          <p className="text-label">Availability</p>
          <StatusBadge tone="green">Open to thoughtful opportunities</StatusBadge>
          <p className="text-sm leading-7 text-text-secondary">Clear communication, practical systems thinking, and a bias toward dependable execution.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="shell space-y-5 p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <FormInput label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <FormInput label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </div>
        <FormInput label="Subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} required />
        <FormTextarea label="Message" rows={6} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} required />
        <button type="submit" disabled={status.loading} className="rounded-full bg-accent-primary px-6 py-3 font-semibold text-white disabled:opacity-60">
          {status.loading ? "Sending..." : "Send message"}
        </button>
        {status.success ? <p className="text-sm text-green-300">{status.success}</p> : null}
        {status.error ? <p className="text-sm text-red-300">{status.error}</p> : null}
      </form>
    </div>
  );
};

export default ContactPage;
