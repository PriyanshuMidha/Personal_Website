import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import cloudinary from "../config/cloudinary.js";
import { getR2Client, isR2Configured } from "../config/r2.js";
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

const uploadToR2 = async (file, folder, resourceType) => {
  const extension = path.extname(file.originalname || "") || (resourceType === "raw" ? ".pdf" : ".bin");
  const key = `${folder.replace(/^portfolio\//, "portfolio/")}/${Date.now()}-${crypto.randomUUID()}${extension}`;

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return {
    assetId: key,
    publicId: key,
    url: `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`,
    originalName: file.originalname,
    bytes: file.size || file.buffer.length,
    format: extension.replace(/^\./, ""),
    resourceType,
  };
};

const uploadToCloudinaryProvider = async (file, folder, resourceType) => {
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

const isCloudinaryConfigured = () =>
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

const uploadToCloudinary = async (file, folder, resourceType = "image") => {
  if (!file?.buffer) {
    throw new ApiError(400, "Upload file is required");
  }

  if (isR2Configured()) {
    return uploadToR2(file, folder, resourceType);
  }

  if (isCloudinaryConfigured()) {
    return uploadToCloudinaryProvider(file, folder, resourceType);
  }

  if (process.env.NODE_ENV === "production") {
    throw new ApiError(
      500,
      "No file storage provider is configured. Uploads cannot be stored reliably in production without one (the local disk fallback is wiped on every restart/redeploy). Set R2_ACCOUNT_ID/R2_ACCESS_KEY_ID/R2_SECRET_ACCESS_KEY/R2_BUCKET_NAME/R2_PUBLIC_URL, or the CLOUDINARY_* equivalents."
    );
  }

  return saveLocally(file, folder, resourceType);
};

export default uploadToCloudinary;
