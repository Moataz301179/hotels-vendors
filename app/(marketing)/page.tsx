import dynamic from "next/dynamic"

const MarketingPage = dynamic(() => import("./page.client"), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
      <p style={{ color: "#fff" }}>Loading HotelsVendors...</p>
    </div>
  ),
})

export default function Page() {
  return <MarketingPage />
}
