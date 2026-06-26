import { MetadataRoute } from "next";
import { getManifest } from "@/lib/pwa/manifest-config";

export const dynamic = "force-dynamic";

export default function manifest(): MetadataRoute.Manifest {
  return getManifest("default");
}
