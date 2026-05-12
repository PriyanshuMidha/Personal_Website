import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import cloudinary from "../config/cloudinary.js";
import ApiError from "./ApiError.js";

const uploadsRoot = path.resolve(process.cwd(), "uploads");

const getPublicServerUrl = () => {
  const configured =
    process.env.PUBLIC_SERVER_URL ||
    process.env.SERVER_URL ||
    process.env.APP_URL;

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  return `http://localhost:${process.env.PORT || 5000}`;
};

const saveLocally = async (file, folder, resourceType) => {
  const folderPath = path.join(uploadsRoot, folder.replace(/^portfolio\//, ""));
  const extension = path.extname(file.originalname || "") || (resourceType === "raw" ? ".pdf" : ".bin");
  const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const absolutePath = path.join(folderPath, filename);

  await fs.mkdir(folderPath, { recursive: true });
  await fs.writeFile(absolutePath, file.buffer);

  const relativePath = path.relative(uploadsRoot, absolutePath).split(path.sep).join("/");

  return {
    assetId: filename,
    publicId: relativePath,
    url: `${getPublicServerUrl()}/uploads/${relativePath}`,
    originalName: file.originalname,
    bytes: file.size || file.buffer.length,
    format: extension.replace(/^\./, ""),
    resourceType,
  };
};

const uploadToCloudinary = async (file, folder, resourceType = "image") => {
  if (!file?.buffer) {
    throw new ApiError(400, "Upload file is required");
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return saveLocally(file, folder, resourceType);
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: resourceType,
  });

  return {
    assetId: result.asset_id,
    publicId: result.public_id,
    url: result.secure_url,
    originalName: file.originalname,
    bytes: result.bytes,
    format: result.format,
    resourceType: result.resource_type,
  };
};

export default uploadToCloudinary;
