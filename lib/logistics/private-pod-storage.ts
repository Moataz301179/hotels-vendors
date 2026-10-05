import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const MAX_POD_PHOTO_BYTES = 10 * 1024 * 1024;

const STORAGE_DIR = process.env.HV_PRIVATE_POD_DIR || "/var/www/hv-pod-private";
const PRIVATE_REFERENCE_PREFIX = "private-pod:";
const PHOTO_TYPES = {
  jpeg: { extension: "jpg", contentType: "image/jpeg" },
  png: { extension: "png", contentType: "image/png" },
  webp: { extension: "webp", contentType: "image/webp" },
} as const;

export type PodPhotoType = (typeof PHOTO_TYPES)[keyof typeof PHOTO_TYPES];

export function detectPodPhotoType(bytes: Uint8Array): PodPhotoType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return PHOTO_TYPES.jpeg;
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return PHOTO_TYPES.png;
  }
  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    return PHOTO_TYPES.webp;
  }
  return null;
}

export function isPrivatePodPhotoReference(value: string): boolean {
  return /^private-pod:[0-9a-f-]{36}\.(jpg|png|webp)$/.test(value);
}

export async function storePrivatePodPhoto(file: File): Promise<{ reference: string; contentType: string }> {
  if (file.size < 1 || file.size > MAX_POD_PHOTO_BYTES) {
    throw new Error("Delivery photo must be between 1 byte and 10 MB");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const type = detectPodPhotoType(bytes);
  if (!type || (file.type && file.type !== type.contentType)) {
    throw new Error("Delivery photo must be a valid JPEG, PNG, or WebP image");
  }

  const fileName = `${randomUUID()}.${type.extension}`;
  await mkdir(STORAGE_DIR, { recursive: true, mode: 0o700 });
  await writeFile(join(STORAGE_DIR, fileName), bytes, { flag: "wx", mode: 0o600 });

  return { reference: `${PRIVATE_REFERENCE_PREFIX}${fileName}`, contentType: type.contentType };
}

export async function readPrivatePodPhoto(reference: string): Promise<{ bytes: Buffer; contentType: string } | null> {
  if (!isPrivatePodPhotoReference(reference)) return null;
  const fileName = reference.slice(PRIVATE_REFERENCE_PREFIX.length);
  const extension = fileName.split(".").at(-1);
  const contentType = extension === "jpg" ? "image/jpeg" : extension === "png" ? "image/png" : "image/webp";

  try {
    return { bytes: await readFile(join(STORAGE_DIR, fileName)), contentType };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function deletePrivatePodPhoto(reference: string): Promise<void> {
  if (!isPrivatePodPhotoReference(reference)) return;
  const fileName = reference.slice(PRIVATE_REFERENCE_PREFIX.length);
  try {
    await unlink(join(STORAGE_DIR, fileName));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
