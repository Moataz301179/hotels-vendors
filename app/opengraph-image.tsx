import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#14110E",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: "linear-gradient(135deg, #FF6B00 0%, #FF8A33 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            HV
          </div>
          <div
            style={{
              color: "#F0F2F5",
              fontSize: 36,
              fontWeight: 600,
              textAlign: "center",
              letterSpacing: "-0.02em",
            }}
          >
            HotelsVendors
          </div>
          <div
            style={{
              color: "rgba(240,242,245,0.5)",
              fontSize: 18,
              textAlign: "center",
              maxWidth: 600,
              lineHeight: 1.4,
            }}
          >
            Egypt&apos;s B2B Procurement Hub for Hotels — Verified Suppliers, Integrated ETA E-Invoicing, Reverse Factoring
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
