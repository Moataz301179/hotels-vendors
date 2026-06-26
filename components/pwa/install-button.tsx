"use client";

import { useInstallPrompt } from "@/lib/pwa/use-installPrompt";
import { Download, Smartphone, X } from "lucide-react";
import { useState } from "react";

export function InstallButton() {
  const { canInstall, isInstalled, isIOS, isSafari, promptInstall, dismiss } = useInstallPrompt();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  const handleClick = async () => {
    if (isIOS && isSafari) {
      setShowIOSGuide(true);
      return;
    }
    const accepted = await promptInstall();
    if (!accepted) {
      setDismissed(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(255,255,255,0.7)",
          backgroundColor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
        title={isIOS ? "Install on iOS" : "Install app"}
      >
        <Smartphone size={14} />
        Install App
      </button>

      {showIOSGuide && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#1a1f2e",
              borderRadius: 12,
              padding: 24,
              maxWidth: 360,
              width: "100%",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#F0F2F5", margin: 0 }}>
                Install on iOS
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(161,168,184,0.85)" }}
              >
                <X size={18} />
              </button>
            </div>
            <ol style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>
                Tap the <strong style={{ color: "#FF6B00" }}>Share</strong> button in Safari
                <Download size={12} style={{ display: "inline", verticalAlign: "middle", marginLeft: 4 }} />
              </li>
              <li style={{ marginBottom: 8 }}>
                Scroll down and tap <strong style={{ color: "#FF6B00" }}>Add to Home Screen</strong>
              </li>
              <li>
                Tap <strong style={{ color: "#FF6B00" }}>Add</strong> to finish
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
