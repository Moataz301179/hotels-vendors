import { describe, expect, it } from "vitest";
import {
  detectPodPhotoType,
  isPrivatePodPhotoReference,
  MAX_POD_PHOTO_BYTES,
} from "@/lib/logistics/private-pod-storage";

describe("private POD photo validation", () => {
  it("recognizes JPEG, PNG, and WebP from file signatures", () => {
    expect(detectPodPhotoType(Uint8Array.from([0xff, 0xd8, 0xff, 0x00]))).toEqual({
      extension: "jpg",
      contentType: "image/jpeg",
    });
    expect(detectPodPhotoType(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toEqual({
      extension: "png",
      contentType: "image/png",
    });
    expect(detectPodPhotoType(Uint8Array.from([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]))).toEqual({
      extension: "webp",
      contentType: "image/webp",
    });
    expect(detectPodPhotoType(Uint8Array.from([0x25, 0x50, 0x44, 0x46]))).toBeNull();
  });

  it("limits uploaded evidence to 10 MB and accepts only opaque generated references", () => {
    expect(MAX_POD_PHOTO_BYTES).toBe(10 * 1024 * 1024);
    expect(isPrivatePodPhotoReference("private-pod:0a0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a0a.jpg")).toBe(true);
    expect(isPrivatePodPhotoReference("private-pod:../../secret.jpg")).toBe(false);
    expect(isPrivatePodPhotoReference("file:///tmp/delivery.jpg")).toBe(false);
  });
});
