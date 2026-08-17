export const HOVIN_PILOT_CODE = "CHV000";

export function isHovinPilotReferral(code?: string | null): boolean {
  return (code || "").trim().toUpperCase() === HOVIN_PILOT_CODE;
}
