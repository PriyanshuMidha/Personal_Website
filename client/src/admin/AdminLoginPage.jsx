import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";

const AdminLoginPage = ({ auth }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await auth.login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      navigate("/admin/dashboard");
    } catch (loginError) {
      setError(loginError.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-dashboard-radial px-6">
      <form onSubmit={handleSubmit} className="shell grid w-full max-w-5xl gap-0 overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid-overlay border-b border-border-soft bg-card p-8 lg:border-b-0 lg:border-r">
          <p className="text-label">Admin Login</p>
          <h1 className="mt-4 max-w-md font-display text-4xl text-text-primary">Manage your portfolio like a developer control room.</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-text-secondary">
            Secure access to projects, experience, messages, resume publishing, and content operations.
          </p>
        </div>
        <div className="space-y-5 p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent-primary">Sign in</p>
            <h2 className="mt-3 font-display text-3xl text-text-primary">Portfolio workspace</h2>
          </div>
          <FormInput label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <FormInput label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <button type="submit" disabled={loading} className="w-full rounded-full bg-accent-primary px-6 py-3 font-semibold text-white">
            {loading ? "Signing in..." : "Sign in"}
          </button>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
        </div>
      </form>
    </div>
  );
};

export default AdminLoginPage;
