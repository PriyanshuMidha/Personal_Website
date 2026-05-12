import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const createCrudController = (service, labels) => ({
  list: asyncHandler(async (req, res) => {
    const data = await service.listAdmin(req.query);
    sendSuccess(res, 200, `${labels.plural} fetched`, data);
  }),
  getById: asyncHandler(async (req, res) => {
    const data = await service.getById(req.params.id);
    sendSuccess(res, 200, `${labels.singular} fetched`, data);
  }),
  create: asyncHandler(async (req, res) => {
    const data = await service.create(req.body);
    sendSuccess(res, 201, `${labels.singular} created`, data);
  }),
  update: asyncHandler(async (req, res) => {
    const data = await service.update(req.params.id, req.body);
    sendSuccess(res, 200, `${labels.singular} updated`, data);
  }),
  remove: asyncHandler(async (req, res) => {
    const data = await service.remove(req.params.id);
    sendSuccess(res, 200, `${labels.singular} deleted`, data);
  }),
});

