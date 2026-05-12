export const serializeProfile = (profile) => {
  if (!profile) {
    return null;
  }

  const socialLinks = profile.socialLinks || [];
  const findSocialUrl = (platform) =>
    socialLinks.find((item) => String(item.platform || "").toLowerCase() === platform)?.url || "";

  return {
    ...profile.toObject(),
    name: profile.fullName || "",
    fullName: profile.fullName || "",
    shortIntro: profile.shortIntro || profile.subheadline || "",
    about: profile.about || profile.aboutDescription || profile.bio || "",
    profileImageUrl: profile.profileImage?.url || profile.profileImageUrl || "",
    resumeUrl: profile.resume?.url || profile.resumeUrl || "",
    githubUrl: profile.githubUrl || findSocialUrl("github"),
    linkedinUrl: profile.linkedinUrl || findSocialUrl("linkedin"),
    instagramUrl: profile.instagramUrl || findSocialUrl("instagram"),
  };
};
