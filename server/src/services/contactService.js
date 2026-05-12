import ContactMessage from "../models/ContactMessage.js";
import ApiError from "../utils/ApiError.js";
import { sendContactNotification } from "./contactNotificationService.js";

export const createMessage = async (payload) => {
  const message = await ContactMessage.create(payload);

  try {
    const notification = await sendContactNotification(message);

    if (process.env.NODE_ENV !== "production" && notification.skipped) {
      console.log(`[contact-notification] skipped for message ${message._id}: ${notification.reason}`);
    }
  } catch (error) {
    console.error(`[contact-notification] failed for message ${message._id}: ${error.message}`);
  }

  return message;
};

export const getMessages = async () =>
  ContactMessage.find().sort({ createdAt: -1 });

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
