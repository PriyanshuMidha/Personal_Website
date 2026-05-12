import ApiError from "../utils/ApiError.js";

const formatJoiErrors = (details = []) =>
  details.map((detail) => ({
    field: detail.path?.join(".") || "form",
    message: detail.message.replace(/["]/g, ""),
  }));

const validate = (schema, source = "body") => (req, _res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    next(new ApiError(400, "Validation failed", formatJoiErrors(error.details)));
    return;
  }

  req[source] = value;
  next();
};

export default validate;
