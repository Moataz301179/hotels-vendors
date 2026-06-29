const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_FROM = process.env.TWILIO_PHONE_FROM || "+15005550006";
const IS_DEV = process.env.NODE_ENV === "development";

export async function sendSms(phone: string, message: string): Promise<{ success: boolean; error?: string }> {
  if (IS_DEV || !TWILIO_SID || !TWILIO_TOKEN) {
    console.log(`[SMS Dev] To: ${phone} — ${message}`);
    return { success: true };
  }

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ From: TWILIO_FROM, To: phone, Body: message }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("[SMS] Twilio error:", err);
      return { success: false, error: "Failed to send SMS" };
    }

    return { success: true };
  } catch (err) {
    console.error("[SMS] Send failed:", err);
    return { success: false, error: "SMS service unavailable" };
  }
}

export async function sendOtpSms(phone: string, code: string): Promise<{ success: boolean; error?: string }> {
  return sendSms(phone, `Your HotelsVendors verification code is: ${code}. Valid for 10 minutes.`);
}
