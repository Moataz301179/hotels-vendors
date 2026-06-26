import { MetadataRoute } from "next";
import { getManifest } from "./manifest";

export const dynamic = "force-dynamic";

export function generateManifest(
  role: "driver" | "hotel" | "supplier" | "factoring" | "default" = "default"
): MetadataRoute.Manifest {
  return getManifest(role);
}

export default generateManifest("default");
