import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { deleteMessage, getMessages, updateMessageStatus } from "../services/contactService.js";

export const listMessages = asyncHandler(async (_req, res) => {
  const messages = await getMessages();
  sendSuccess(res, 200, "Messages fetched", messages);
});

export const patchMessageStatus = asyncHandler(async (req, res) => {
  const message = await updateMessageStatus(req.params.id, req.body.status);
  sendSuccess(res, 200, "Message updated", message);
});

export const removeMessage = asyncHandler(async (req, res) => {
  const message = await deleteMessage(req.params.id);
  sendSuccess(res, 200, "Message deleted", message);
});

