import MarketingPage from "./page.client";

// Bust the year-long ISR cache so nav/layout changes are served promptly.
export const revalidate = 0;

export default function Page() {
  return <MarketingPage />;
}

