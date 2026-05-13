import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import FormInput from "../components/FormInput";
import FormTextarea from "../components/FormTextarea";
import FormArrayInput from "../components/FormArrayInput";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import ImageUploader from "../components/ImageUploader";
import SectionHeader from "../components/SectionHeader";
import useToast from "../hooks/useToast";
import { invalidateCache } from "../utils/apiCache";
import { normalizeProfilePayload, validateProfilePayload } from "../utils/cms";

const formatProfileError = (error) => {
  if (error?.errors?.length) {
    return error.errors.map((entry) => `${entry.field}: ${entry.message}`).join(" | ");
  }

  return error?.message || "Unable to save profile";
};

const emptyProfile = {
  name: "",
  fullName: "",
  headline: "",
  shortIntro: "",
  subheadline: "",
  bio: "",
  about: "",
  location: "",
  email: "",
  phone: "",
  heroDescription: "",
  aboutTitle: "",
  aboutDescription: "",
  yearsOfExperience: 0,
  currentRole: "",
  currentCompany: "",
  githubUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
  profileImageUrl: "",
  resumeUrl: "",
  highlights: [],
  specialties: [],
  socialLinks: [],
  isPublished: true,
};

const ProfilePage = () => {
  const [form, setForm] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await adminApi.getProfile();
        setForm({ ...emptyProfile, ...(response.data || {}) });
      } catch (loadError) {
        setError(loadError.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSocialChange = (index, field, value) => {
    const next = [...(form.socialLinks || [])];
    next[index] = { ...(next[index] || {}), [field]: value };
    setField("socialLinks", next);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const payload = normalizeProfilePayload(form);
    const validationErrors = validateProfilePayload(payload);

    if (validationErrors.length) {
      const message = validationErrors.join(" | ");
      setError(message);
      toast.error(message);
      return;
    }

    setSaving(true);

    try {
      const response = await adminApi.updateProfile(payload);
      setForm({ ...emptyProfile, ...(response.data || {}) });
      invalidateCache(["admin:dashboard:overview", "public:profile", "public:home"]);
      toast.success("Profile updated successfully.");
    } catch (saveError) {
      const message = formatProfileError(saveError);
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading profile settings..." />;
  if (error && !form) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Profile"
        title="Public identity settings"
        description="Shape the headline, narrative, social presence, and publishing details that drive the public-facing portfolio."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="shell space-y-5 p-6 xl:col-span-2">
            <p className="text-label">Primary profile</p>
            <div className="grid gap-5 md:grid-cols-2">
              <FormInput label="Name" value={form.name || form.fullName} onChange={(event) => { setField("name", event.target.value); setField("fullName", event.target.value); }} />
              <FormInput label="Headline" value={form.headline} onChange={(event) => setField("headline", event.target.value)} />
              <FormInput label="Short Intro" value={form.shortIntro || form.subheadline} onChange={(event) => { setField("shortIntro", event.target.value); setField("subheadline", event.target.value); }} />
              <FormInput label="Location" value={form.location} onChange={(event) => setField("location", event.target.value)} />
              <FormInput label="Contact Email" type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} />
              <FormInput label="Phone" value={form.phone} onChange={(event) => setField("phone", event.target.value)} />
              <FormInput label="Current Role" value={form.currentRole} onChange={(event) => setField("currentRole", event.target.value)} />
              <FormInput label="Current Company" value={form.currentCompany} onChange={(event) => setField("currentCompany", event.target.value)} />
              <FormInput label="Years of Experience" type="number" min={0} value={form.yearsOfExperience ?? 0} onChange={(event) => setField("yearsOfExperience", event.target.value)} />
            </div>
            <FormTextarea label="Hero Description" value={form.heroDescription} onChange={(event) => setField("heroDescription", event.target.value)} />
            <FormTextarea label="Short Intro / Bio" value={form.bio} onChange={(event) => setField("bio", event.target.value)} />
            <FormTextarea label="About" value={form.about || form.aboutDescription} onChange={(event) => { setField("about", event.target.value); setField("aboutDescription", event.target.value); }} />
          </div>

          <div className="shell space-y-5 p-6">
            <p className="text-label">Profile image</p>
            <ImageUploader label="Upload profile image" onUploaded={(asset) => setField("profileImage", asset)} />
            {form.profileImage?.url ? <img src={form.profileImage.url} alt="Profile" className="rounded-[22px] border border-border-soft" /> : null}
            <FormInput label="Profile Image URL" value={form.profileImageUrl || ""} onChange={(event) => setField("profileImageUrl", event.target.value)} />
            <FormInput label="Resume URL" value={form.resumeUrl || ""} onChange={(event) => setField("resumeUrl", event.target.value)} />
            <label className="flex items-center gap-3 text-sm text-text-secondary">
              <input type="checkbox" checked={Boolean(form.isPublished)} onChange={(event) => setField("isPublished", event.target.checked)} />
              Published publicly
            </label>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="shell space-y-5 p-6">
            <p className="text-label">About and SEO</p>
            <FormInput label="About Title" value={form.aboutTitle} onChange={(event) => setField("aboutTitle", event.target.value)} />
            <FormTextarea label="About Description" value={form.aboutDescription} onChange={(event) => setField("aboutDescription", event.target.value)} />
            <FormArrayInput label="Highlights" value={form.highlights} onChange={(value) => setField("highlights", value)} />
            <FormArrayInput label="Specialties" value={form.specialties} onChange={(value) => setField("specialties", value)} />
            <FormInput label="SEO Title" value={form.seoTitle || ""} onChange={(event) => setField("seoTitle", event.target.value)} />
            <FormTextarea label="SEO Description" value={form.seoDescription || ""} onChange={(event) => setField("seoDescription", event.target.value)} />
          </div>

          <div className="shell space-y-5 p-6">
            <div className="flex items-center justify-between">
              <p className="text-label">Social links</p>
              <button
                type="button"
                onClick={() => setField("socialLinks", [...(form.socialLinks || []), { platform: "", url: "", icon: "" }])}
                className="rounded-full border border-border-soft px-4 py-2 text-sm text-text-secondary"
              >
                Add social
              </button>
            </div>
            <FormInput label="GitHub URL" value={form.githubUrl || ""} onChange={(event) => setField("githubUrl", event.target.value)} />
            <FormInput label="LinkedIn URL" value={form.linkedinUrl || ""} onChange={(event) => setField("linkedinUrl", event.target.value)} />
            <FormInput label="Instagram URL" value={form.instagramUrl || ""} onChange={(event) => setField("instagramUrl", event.target.value)} />
            {(form.socialLinks || []).map((link, index) => (
              <div key={`${link.platform}-${index}`} className="card-surface grid gap-4 p-4">
                <FormInput label="Platform" value={link.platform || ""} onChange={(event) => handleSocialChange(index, "platform", event.target.value)} />
                <FormInput label="URL" value={link.url || ""} onChange={(event) => handleSocialChange(index, "url", event.target.value)} />
                <FormInput label="Icon" value={link.icon || ""} onChange={(event) => handleSocialChange(index, "icon", event.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={saving} className="rounded-full bg-accent-primary px-6 py-3 font-semibold text-white disabled:opacity-60">
            {saving ? "Saving..." : "Save profile"}
          </button>
          <a href="/about" target="_blank" rel="noopener noreferrer" className="rounded-full border border-border-soft px-5 py-3 text-sm text-text-secondary hover:text-text-primary">
            View public page
          </a>
        </div>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
      </form>
    </div>
  );
};

export default ProfilePage;
