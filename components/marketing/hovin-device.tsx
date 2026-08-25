"use client";

import React from "react";

/* HOVIN device showcase — Swiss International theme (owner-provided design).
   Sharp rectangle device, hard offset shadow, red signal accents, animated
   scanner line. Replaces the hero carousel. Pure CSS/SVG, no images. */

const RED = "#FF3000";

export function HovinDevice() {
  return (
    <div className="relative flex justify-center" aria-label="HOVIN mobile app preview">
      <style>{`
        .hv-stage::before { content: ""; position: absolute; inset: -48px -60px;
          background-image: linear-gradient(to right, rgba(255,255,255,.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,.035) 1px, transparent 1px);
          background-size: 24px 24px; pointer-events: none; }
        .hv-device { position: relative; width: 340px; max-width: 88vw; background: #000;
          border: 1px solid #26262B; border-radius: 52px; padding: 10px;
          box-shadow: 0 34px 80px rgba(0,0,0,.7), inset 0 0 0 2px #000; }
        .hv-screen { position: relative; background: #FFFFFF; border-radius: 42px; overflow: hidden;
          display: flex; flex-direction: column; color: #000; }
        .hv-status { position: relative; height: 38px; display: flex; align-items: center;
          justify-content: space-between; padding: 0 22px 0 28px; }
        .hv-time { font-size: 13px; font-weight: 700; letter-spacing: .4px; font-variant-numeric: tabular-nums; }
        .hv-island { position: absolute; top: 9px; left: 50%; transform: translateX(-50%);
          width: 100px; height: 28px; background: #000; border-radius: 16px; }
        .hv-header { display: flex; justify-content: space-between; align-items: flex-start;
          padding: 2px 16px 8px; border-bottom: 2px solid #000; }
        .hv-mark { width: 10px; height: 10px; background: ${RED}; }
        .hv-name { font-size: 18px; font-weight: 900; letter-spacing: 4px; line-height: 1; }
        .hv-brand-sub { font-size: 7px; font-weight: 500; letter-spacing: 1.6px; color: #555;
          margin-top: 4px; padding-left: 18px; text-transform: uppercase; white-space: nowrap; }
        .hv-prop { display: flex; align-items: center; gap: 5px; border: 2px solid #000;
          padding: 4px 8px; font-size: 7.5px; font-weight: 700; letter-spacing: .6px;
          text-transform: uppercase; background: #fff; margin-top: 2px; white-space: nowrap; }
        .hv-dot-blink { width: 6px; height: 6px; background: ${RED}; animation: hvBlink 1s steps(2,end) infinite; }
        .hv-hud { margin: 8px 14px 0; border: 2px solid #000; background: #fff;
          background-image: linear-gradient(to right, rgba(0,0,0,.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,.03) 1px, transparent 1px); background-size: 24px 24px; }
        .hv-ship { display: flex; justify-content: space-between; align-items: center;
          padding: 9px 12px; border-bottom: 2px solid #000; background: #F2F2F2; }
        .hv-lbl { font-size: 7px; font-weight: 700; letter-spacing: 1.2px; color: #555; text-transform: uppercase; }
        .hv-idx { color: ${RED}; font-weight: 900; margin-right: 5px; }
        .hv-chip { color: ${RED}; border: 1.5px solid ${RED}; font-size: 7px; font-weight: 900;
          letter-spacing: 1px; padding: 2.5px 6px; text-transform: uppercase; margin-left: 6px; }
        .hv-ship-name { font-size: 13px; font-weight: 900; letter-spacing: -.2px; margin-top: 4px; text-transform: uppercase; line-height: 1.1; }
        .hv-ship-sub { font-size: 8px; color: #555; margin-top: 3px; letter-spacing: .5px; font-variant-numeric: tabular-nums; text-transform: uppercase; }
        .hv-stats { display: flex; }
        .hv-stat { flex: 1; padding: 8px 12px 9px; }
        .hv-stat + .hv-stat { border-left: 1px solid #000; }
        .hv-val { font-size: 14.5px; font-weight: 900; margin-top: 5px; letter-spacing: -.3px; font-variant-numeric: tabular-nums; }
        .hv-sub { font-size: 7px; color: #8A8A8A; margin-top: 4px; letter-spacing: .7px; text-transform: uppercase; }
        .hv-vf { position: relative; margin: 8px 14px 0; height: 190px; border: 2px solid #000;
          overflow: hidden; background: #F6F6F6; }
        .hv-vtag { position: absolute; display: flex; align-items: center; gap: 5px; background: #000;
          padding: 3px 7px; font-size: 8px; font-weight: 700; letter-spacing: 1.4px; color: #fff;
          font-variant-numeric: tabular-nums; line-height: 1; }
        .hv-dot-red { width: 6px; height: 6px; background: ${RED}; animation: hvBlink 1s steps(2,end) infinite; }
        .hv-scan { position: absolute; left: 50%; top: 52%; transform: translate(-50%,-50%);
          width: 180px; height: 128px; }
        .hv-bracket { position: absolute; width: 20px; height: 20px; border: 2.5px solid ${RED}; }
        .hv-sline { position: absolute; left: 0; right: 0; top: 50%; height: 2px; background: ${RED};
          animation: hvScan 2.6s ease-in-out infinite; }
        .hv-auto { position: absolute; top: -15px; left: 0; font-size: 6.5px; font-weight: 900;
          letter-spacing: 2.4px; color: ${RED}; line-height: 1; }
        .hv-vf-foot { display: flex; justify-content: space-between; align-items: center;
          margin: 7px 16px 0; padding: 0 2px; }
        .hv-cap { font-size: 8px; font-weight: 700; letter-spacing: .7px; color: #000; text-transform: uppercase; }
        .hv-modes { display: flex; gap: 4px; }
        .hv-mode { font-size: 7px; font-weight: 800; letter-spacing: 1px; padding: 3.5px 6px;
          text-transform: uppercase; line-height: 1; }
        .hv-mode.on { background: #000; color: #fff; }
        .hv-mode.off { background: #fff; color: #000; border: 1.5px solid #000; }
        .hv-drawer { margin: 8px 14px 0; border: 2px solid #000; background: #F2F2F2; position: relative; }
        .hv-grab { position: absolute; top: 6px; left: 50%; transform: translateX(-50%);
          width: 40px; height: 3px; background: #000; }
        .hv-d-head { display: flex; justify-content: space-between; padding: 11px 12px 8px; }
        .hv-m-val { font-size: 12px; font-weight: 900; margin-top: 2px; }
        .hv-row { display: flex; align-items: center; gap: 9px; padding: 7px 12px; border-top: 1px solid #000; background: #fff; }
        .hv-r-ico { width: 26px; height: 26px; border: 1.5px solid #000; background: #fff; flex: none;
          display: flex; align-items: center; justify-content: center; }
        .hv-r-name { font-size: 10.5px; font-weight: 800; letter-spacing: .1px; text-transform: uppercase;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; }
        .hv-r-sub { font-size: 8px; color: #555; margin-top: 2px; letter-spacing: .4px; text-transform: uppercase; font-variant-numeric: tabular-nums; }
        .hv-tag { font-size: 7px; font-weight: 800; letter-spacing: .8px; padding: 3px 5px;
          text-transform: uppercase; line-height: 1.2; }
        .hv-tag.ok { color: #000; border: 1.5px solid #000; background: #fff; }
        .hv-tag.hold { color: #fff; border: 1.5px solid ${RED}; background: ${RED}; }
        .hv-d-foot { display: flex; justify-content: space-between; align-items: center;
          padding: 7px 12px; border-top: 2px solid #000; background: #F2F2F2; }
        .hv-btn { background: #000; color: #fff; font-size: 9px; font-weight: 900; letter-spacing: 1.2px;
          padding: 8px 11px; text-transform: uppercase; transition: background .15s; }
        .hv-btn:hover { background: ${RED}; }
        .hv-nav { margin-top: auto; border-top: 2px solid #000; background: #fff; }
        .hv-nav-inner { display: flex; padding: 7px 4px 5px; }
        .hv-tab { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
          color: #9A9A9A; position: relative; }
        .hv-tab span { font-size: 7px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        .hv-tab.active { color: #000; }
        .hv-tab.active::after { content: ""; position: absolute; top: -8px; width: 18px; height: 3px; background: ${RED}; }
        .hv-homebar { width: 100px; height: 4px; background: #000; margin: 0 auto 6px; }
        @keyframes hvScan { 0% { top: 10%; } 50% { top: 88%; } 100% { top: 10%; } }
        @keyframes hvBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: .15; } }
        @media (prefers-reduced-motion: reduce) {
          .hv-sline, .hv-dot-red, .hv-dot-blink { animation: none; }
        }
      `}</style>

      <div className="hv-stage relative">
        <div className="hv-device">
          <div className="hv-screen">
            {/* Status bar */}
            <div className="hv-status">
              <span className="hv-time">14:18</span>
              <div className="hv-island" />
              <svg width="17" height="11" viewBox="0 0 27 13" aria-hidden>
                <rect x="0.5" y="0.5" width="22" height="12" fill="none" stroke="#000" />
                <rect x="2.5" y="2.5" width="14.5" height="8" fill="#000" />
                <path d="M24.5 4.2v4.6a2.2 2.2 0 0 0 0-4.6z" fill="#000" opacity=".4" />
              </svg>
            </div>

            {/* Header */}
            <div className="hv-header">
              <div>
                <div className="flex items-center gap-2">
                  <span className="hv-mark" />
                  <span className="hv-name">HOVIN</span>
                </div>
                <div className="hv-brand-sub">Hotels Vendors · Ops Layer</div>
              </div>
              <div className="hv-prop">
                <span className="hv-dot-blink" />
                Cairo Marina Hotel
              </div>
            </div>

            {/* HUD */}
            <div className="hv-hud">
              <div className="hv-ship">
                <div>
                  <div className="hv-lbl">
                    <span className="hv-idx">01</span>INCOMING SHIPMENT
                    <span className="hv-chip">In Transit</span>
                  </div>
                  <div className="hv-ship-name">F&amp;B Supply Batch #4471</div>
                  <div className="hv-ship-sub">HV Logistics · Van 27 · ETA 14:20 · 2.1 KM</div>
                </div>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.6" strokeLinecap="square" aria-hidden>
                  <path d="M2.5 7.5h11v9h-11z" /><path d="M13.5 10.5h3.8l3.2 3v3h-7z" />
                  <circle cx="7" cy="18" r="1.7" /><circle cx="17" cy="18" r="1.7" />
                </svg>
              </div>
              <div className="hv-stats">
                <div className="hv-stat">
                  <div className="hv-lbl"><span className="hv-idx">02</span>Validated Value</div>
                  <div className="hv-val">EGP 486,320</div>
                  <div className="hv-sub">PO #HV-2026-08841</div>
                </div>
                <div className="hv-stat">
                  <div className="hv-lbl"><span className="hv-idx">03</span>ETA Compliance</div>
                  <div className="hv-val" style={{ color: RED, fontSize: 11 }}>UUID VERIFIED</div>
                  <div className="hv-sub">Synced 0.4s · 16/16 lines</div>
                </div>
              </div>
            </div>

            {/* Viewfinder */}
            <div className="hv-vf">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 351 222" preserveAspectRatio="xMidYMid slice" aria-hidden>
                <rect x="0" y="0" width="351" height="138" fill="#0C0D10" />
                <rect x="20" y="20" width="92" height="118" fill="#0E1013" stroke="#1C1F24" />
                <rect x="268" y="36" width="56" height="18" fill="#0F1115" stroke="#1C1F24" />
                <text x="296" y="48.5" fontSize="8" fontWeight="700" fill="#3E4147" textAnchor="middle" letterSpacing="1.5">DOCK 02</text>
                <rect x="0" y="138" width="351" height="84" fill="#131418" />
                <polygon points="20,112 331,112 351,178 0,178" fill="#7A4E2E" />
                <polygon points="0,178 351,178 351,222 0,222" fill="#4A2E1A" />
                <g transform="rotate(-3 150 162)">
                  <rect x="94" y="102" width="112" height="120" fill="#FCFBF5" />
                  <text x="102" y="116" fontSize="5" fontWeight="900" fill="#141414" letterSpacing=".5">HOTELS VENDORS</text>
                  <text x="200" y="116" fontSize="4.5" fontWeight="700" fill="#666" textAnchor="end">TAX INVOICE</text>
                  <line x1="102" y1="122" x2="200" y2="122" stroke="#CFCABC" />
                  <text x="102" y="131" fontSize="5" fontWeight="700" fill="#141414">INV #SV-20917</text>
                  <g fill="#2A2A2A">
                    <rect x="102" y="142" width="46" height="2.2" /><rect x="102" y="152" width="40" height="2.2" />
                    <rect x="102" y="162" width="46" height="2.2" /><rect x="102" y="172" width="36" height="2.2" />
                  </g>
                  <line x1="102" y1="190" x2="200" y2="190" stroke="#CFCABC" />
                  <text x="102" y="201" fontSize="5" fontWeight="900" fill="#141414">TOTAL</text>
                  <text x="200" y="201" fontSize="5.5" fontWeight="900" fill="#141414" textAnchor="end">EGP 486,320</text>
                </g>
              </svg>

              <div className="hv-vtag" style={{ top: 8, left: 8 }}>
                <span className="hv-dot-red" />LIVE
              </div>
              <div className="hv-vtag" style={{ top: 8, right: 8 }}>DOCK CAM 02</div>
              <div className="hv-vtag" style={{ bottom: 8, left: 8 }}>1080P60 · AF</div>

              <div className="hv-scan">
                <span className="hv-auto">AUTO-LOCK</span>
                <svg className="absolute inset-0 w-full h-full" aria-hidden>
                  <g stroke={RED} strokeOpacity=".3">
                    <line x1="25%" y1="0" x2="25%" y2="100%" /><line x1="50%" y1="0" x2="50%" y2="100%" />
                    <line x1="75%" y1="0" x2="75%" y2="100%" />
                    <line x1="0" y1="33.3%" x2="100%" y2="33.3%" /><line x1="0" y1="66.6%" x2="100%" y2="66.6%" />
                  </g>
                </svg>
                <div className="hv-sline" />
                <span className="hv-bracket" style={{ left: 0, top: 0, transform: "translate(-50%,-50%)", borderRight: "none", borderBottom: "none" }} />
                <span className="hv-bracket" style={{ right: 0, top: 0, transform: "translate(50%,-50%)", borderLeft: "none", borderBottom: "none" }} />
                <span className="hv-bracket" style={{ left: 0, bottom: 0, transform: "translate(-50%,50%)", borderRight: "none", borderTop: "none" }} />
                <span className="hv-bracket" style={{ right: 0, bottom: 0, transform: "translate(50%,50%)", borderLeft: "none", borderTop: "none" }} />
              </div>
            </div>

            <div className="hv-vf-foot">
              <span className="hv-cap">Last Capture · Invoice #SV-20917</span>
              <span className="hv-modes">
                <span className="hv-mode off">Barcode</span>
                <span className="hv-mode on">Invoice OCR</span>
              </span>
            </div>

            {/* OCR drawer */}
            <div className="hv-drawer">
              <div className="hv-grab" />
              <div className="hv-d-head">
                <div>
                  <div className="hv-lbl"><span className="hv-idx">04</span>Paper Invoice · OCR</div>
                  <div className="hv-r-sub" style={{ marginTop: 4 }}>SUP INV #SV-20917 · PO #HV-2026-08841</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="hv-lbl">LINE MATCH</div>
                  <div className="hv-m-val"><span style={{ color: RED }}>15</span>/16</div>
                </div>
              </div>
              <div className="hv-row">
                <div className="hv-r-ico">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" aria-hidden>
                    <path d="M9.5 3h5M10.5 3v3.5L8.5 9a2.6 2.6 0 0 0-.5 1.6V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-7.4A2.6 2.6 0 0 0 15.5 9l-2-2.5V3" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="hv-r-name">Olive Oil EV · 5L</div>
                  <div className="hv-r-sub">QTY 48 · EGP 96,000 · PO 07/16</div>
                </div>
                <span className="hv-tag ok">Tax ✓</span>
                <span className="hv-tag ok">Stk In</span>
              </div>
              <div className="hv-row">
                <div className="hv-r-ico">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" aria-hidden>
                    <path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z" />
                    <path d="M16 10h2.3a2.7 2.7 0 0 1 0 5.4H16" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="hv-r-name">Arabic Coffee · 1KG</div>
                  <div className="hv-r-sub">QTY 120 · EGP 61,200 · PO 03/16</div>
                </div>
                <span className="hv-tag ok">Tax ✓</span>
                <span className="hv-tag ok">Stk In</span>
              </div>
              <div className="hv-d-foot">
                <span className="hv-lbl">16 lines · 15 verified · 1 hold</span>
                <span className="hv-btn">Post to Ledger →</span>
              </div>
            </div>

            {/* Bottom nav */}
            <div className="hv-nav">
              <div className="hv-nav-inner">
                <div className="hv-tab">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" />
                    <rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" />
                  </svg>
                  <span>Dashboard</span>
                </div>
                <div className="hv-tab active">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
                    <path d="M4 12h16" />
                  </svg>
                  <span>Scanner</span>
                </div>
                <div className="hv-tab">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path d="M2.5 7.5h11v9h-11z" /><path d="M13.5 10.5h3.8l3.2 3v3h-7z" />
                    <circle cx="7" cy="18" r="1.7" /><circle cx="17" cy="18" r="1.7" />
                  </svg>
                  <span>Live Orders</span>
                </div>
                <div className="hv-tab">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path d="M6 3.5h9L19 7.5v13H6z" /><path d="M15 3.5v4h4" />
                  </svg>
                  <span>Ledger</span>
                </div>
              </div>
              <div className="hv-homebar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
