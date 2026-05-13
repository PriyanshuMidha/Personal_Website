export const serializeProfile = (profile) => {
  if (!profile) {
    return null;
  }

  const rawProfile = typeof profile.toObject === "function" ? profile.toObject() : profile;

  const socialLinks = rawProfile.socialLinks || [];
  const findSocialUrl = (platform) =>
    socialLinks.find((item) => String(item.platform || "").toLowerCase() === platform)?.url || "";

  return {
    ...rawProfile,
    name: rawProfile.fullName || "",
    fullName: rawProfile.fullName || "",
    shortIntro: rawProfile.shortIntro || rawProfile.subheadline || "",
    about: rawProfile.about || rawProfile.aboutDescription || rawProfile.bio || "",
    profileImageUrl: rawProfile.profileImage?.url || rawProfile.profileImageUrl || "",
    resumeUrl: rawProfile.resume?.url || rawProfile.resumeUrl || "",
    githubUrl: rawProfile.githubUrl || findSocialUrl("github"),
    linkedinUrl: rawProfile.linkedinUrl || findSocialUrl("linkedin"),
    instagramUrl: rawProfile.instagramUrl || findSocialUrl("instagram"),
  };
};
