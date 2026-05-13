import ContactMessage from "../models/ContactMessage.js";
import ApiError from "../utils/ApiError.js";
import { sendContactNotification } from "./contactNotificationService.js";

export const createMessage = async (payload) => {
  const message = await ContactMessage.create(payload);
  let notification = { delivered: false, skipped: true, reason: "Contact notifications not configured" };

  try {
    notification = await sendContactNotification(message);

    if (process.env.NODE_ENV !== "production" && notification.skipped) {
      console.log(`[contact-notification] skipped for message ${message._id}: ${notification.reason}`);
    }
  } catch (error) {
    console.error(`[contact-notification] failed for message ${message._id}: ${error.message}`);
    notification = {
      delivered: false,
      skipped: false,
      failed: true,
      reason: error.message,
    };
  }

  return { message, notification };
};

export const getMessages = async () =>
  ContactMessage.find().sort({ createdAt: -1 });

export const getPaginatedMessages = async (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
  const filter = {
    ...(query.status ? { status: query.status } : {}),
  };

  const [items, total] = await Promise.all([
    ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    ContactMessage.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const updateMessageStatus = async (id, status) => {
  const message = await ContactMessage.findByIdAndUpdate(id, { status }, { new: true });
  if (!message) {
    throw new ApiError(404, "Contact message not found");
  }
  return message;
};

export const deleteMessage = async (id) => {
  const message = await ContactMessage.findByIdAndDelete(id);
  if (!message) {
    throw new ApiError(404, "Contact message not found");
  }
  return message;
};
