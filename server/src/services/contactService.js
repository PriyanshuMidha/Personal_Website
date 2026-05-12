import ContactMessage from "../models/ContactMessage.js";
import ApiError from "../utils/ApiError.js";

export const createMessage = (payload) => ContactMessage.create(payload);

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

