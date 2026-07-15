import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    // AI assistant logic - returns contextual suggestions
    const response = generateAIResponse(message, context);

    return NextResponse.json({
      success: true,
      response,
      suggestions: generateFollowUpSuggestions(message),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

function generateAIResponse(message: string, context: { platform: string; role: string; currentMetrics: Record<string, number> }): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("revenue") || lowerMessage.includes("money") || lowerMessage.includes("fee")) {
    return `Based on your current metrics:\n\n**Revenue Analysis:**\n• Total Revenue: EGP ${context.currentMetrics.totalOrders.toLocaleString()} orders processed\n• Platform Fees: 2% per transaction (no maximum)\n• Factoring Commissions: Revenue from Oliv partnership\n\n**Recommendations:**\n1. **Tiered Pricing** — Consider 2.5% for premium suppliers, 1.5% for volume suppliers\n2. **Subscription Tiers** — Add PRO tier with advanced analytics (EGP 2,000/month)\n3. **Factoring Spread** — Negotiate higher commission with Oliv after PoC\n\n**Quick Win:** Enable sponsored listings for suppliers (EGP 500/listing/month). Expected: EGP 50K/month.`;
  }

  if (lowerMessage.includes("grow") || lowerMessage.includes("acquisition") || lowerMessage.includes("supplier")) {
    return `**Growth Strategy for HotelsVendors:**\n\n**Phase 1 (Month 1-3):**\n• Target 6th of October City factories (1,853 suppliers)\n• Onboard 50 hotels in Cairo/Giza\n• Sign 2 pilot hotel groups\n\n**Phase 2 (Month 4-6):**\n• Expand to 10th of Ramadan (3,000+ factories)\n• Launch supplier referral program\n• Add Fawry/Halan as funder partners\n\n**Phase 3 (Month 7-12):**\n• Coastal clusters (Alexandria, Hurghada)\n• Launch mobile app\n• Target 500 suppliers, 200 hotels\n\n**Key Metrics:**\n• Current: 89 suppliers, 145 hotels\n• Target: 500 suppliers, 200 hotels in 12 months`;
  }

  if (lowerMessage.includes("feature") || lowerMessage.includes("missing") || lowerMessage.includes("enhancement")) {
    return `**Missing Features for MVP Completion:**\n\n**Critical (Ship Now):**\n1. Mobile App — React Native (see mobile plan below)\n2. Push Notifications — Order status, factoring updates\n3. Barcode Scanner — PO receiving, inventory sync\n4. Multi-language — Arabic support for Egyptian market\n\n**Important (Month 2-3):**\n5. Advanced Analytics — Predictive restock, spend forecasting\n6. Supplier Portal — Product catalog management, bulk upload\n7. Hotel Portal — Multi-property procurement governance\n8. ERP Integration — Opera PMS, SAP connectors\n\n**Nice to Have (Month 4-6):**\n9. AI Chatbot — Supplier/hotel support\n10. Loyalty Program — Points for early payments\n11. Marketplace — Direct supplier-to-supplier sales`;
  }

  if (lowerMessage.includes("compliance") || lowerMessage.includes("eta") || lowerMessage.includes("tax")) {
    return `**ETA Compliance Status:**\n\n**Current State:**\n• Invoice upload: ✅ Working\n• ETA UUID validation: ✅ Working\n• E-invoice submission: ⏳ Pending API access\n\n**Action Items:**\n1. **ETA API Access** — Apply for production credentials\n2. **Digital Signing** — Implement XML signature for invoices\n3. **Auto-Submission** — Background queue for failed submissions\n4. **Dead Letter Queue** — Manual resolution for edge cases\n\n**FRA Decision No. 51/2026:**\n• Oliv must freeze invoice in centralized portal\n• HotelsVendors webhook verifies referral token\n• Audit log for every compliance event`;
  }

  return `I understand you're asking about "${message}". Here's my analysis:\n\n**Current Platform Status:**\n• Users: ${context.currentMetrics.totalUsers}\n• Orders: ${context.currentMetrics.totalOrders}\n• Platform Fees: EGP ${context.currentMetrics.platformFees.toLocaleString()}\n\n**Suggested Actions:**\n1. Review analytics dashboard for trends\n2. Check user engagement metrics\n3. Monitor factoring volume with Oliv\n4. Plan mobile app development\n\nWould you like me to dive deeper into any specific area?`;
}

function generateFollowUpSuggestions(message: string): string[] {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("revenue")) return ["How to increase platform fees?", "Show me fee breakdown", "Factoring revenue trends"];
  if (lowerMessage.includes("grow")) return ["Supplier acquisition strategy", "Hotel onboarding plan", "Referral program design"];
  if (lowerMessage.includes("feature")) return ["Mobile app roadmap", "Priority feature list", "Technical debt assessment"];
  if (lowerMessage.includes("compliance")) return ["ETA integration steps", "FRA requirements", "Audit trail setup"];

  return ["Show revenue insights", "How can we grow faster?", "What features are missing?", "Analyze user behavior"];
}
