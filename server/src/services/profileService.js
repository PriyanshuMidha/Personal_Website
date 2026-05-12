import Profile from "../models/Profile.js";
import { createActivityLog } from "./activityService.js";
import { serializeProfile } from "./profileSerializer.js";

export const getProfile = async ({ publishedOnly = false } = {}) => {
  const filter = publishedOnly ? { isPublished: true } : {};
  let profile = await Profile.findOne(filter);

  if (!profile && !publishedOnly) {
    profile = await Profile.create({});
  }

  return profile;
};

export const updateProfile = async (payload, options = {}) => {
  const profile = (await Profile.findOne()) || new Profile({});
  const normalizedPayload = {
    ...payload,
    fullName: payload.fullName ?? payload.name ?? profile.fullName ?? "",
    shortIntro: payload.shortIntro ?? payload.subheadline ?? profile.shortIntro ?? "",
    subheadline: payload.subheadline ?? payload.shortIntro ?? profile.subheadline ?? "",
    bio: payload.bio ?? payload.about ?? profile.bio ?? "",
    about: payload.about ?? payload.aboutDescription ?? profile.about ?? "",
    aboutDescription: payload.aboutDescription ?? payload.about ?? profile.aboutDescription ?? "",
    profileImageUrl: payload.profileImageUrl ?? payload.profileImage?.url ?? profile.profileImageUrl ?? "",
    resumeUrl: payload.resumeUrl ?? payload.resume?.url ?? profile.resumeUrl ?? "",
    githubUrl: payload.githubUrl ?? profile.githubUrl ?? "",
    linkedinUrl: payload.linkedinUrl ?? profile.linkedinUrl ?? "",
    instagramUrl: payload.instagramUrl ?? profile.instagramUrl ?? "",
  };

  const socialLinks = [...(normalizedPayload.socialLinks || profile.socialLinks || [])];
  const upsertSocial = (platform, url) => {
    if (!url) return;
    const existingIndex = socialLinks.findIndex((item) => String(item.platform || "").toLowerCase() === platform);
    const nextItem = { platform, url, icon: platform };
    if (existingIndex >= 0) {
      socialLinks[existingIndex] = { ...socialLinks[existingIndex], ...nextItem };
    } else {
      socialLinks.push(nextItem);
    }
  };

  upsertSocial("github", normalizedPayload.githubUrl);
  upsertSocial("linkedin", normalizedPayload.linkedinUrl);
  upsertSocial("instagram", normalizedPayload.instagramUrl);

  normalizedPayload.socialLinks = socialLinks.filter((item) => item?.platform && item?.url);

  Object.assign(profile, normalizedPayload);
  await profile.save();
  if (!options.skipActivityLog) {
    await createActivityLog({
      actionType: "update",
      module: "profile",
      title: "Profile updated",
      description: `Updated public profile content for ${profile.fullName || "portfolio owner"}.`,
    });
  }
  return serializeProfile(profile);
};

export const getSerializedProfile = async (options = {}) => {
  const profile = await getProfile(options);
  return serializeProfile(profile);
};
