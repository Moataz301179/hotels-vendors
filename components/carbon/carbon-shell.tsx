"use client";

import { ReactNode, useState } from "react";
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  SkipToContent,
  Content,
} from "@carbon/react";
import {
  Search,
  Notification,
  UserAvatar,
  ShoppingCart,
  Dashboard,
  Store,
  Document,
  CurrencyDollar,
  ShieldAlert,
  Logout,
} from "@carbon/icons-react";

interface CarbonShellProps {
  children: ReactNode;
  role: string;
  userName?: string;
  tenantName?: string;
}

export function CarbonShell({ children, role, userName, tenantName }: CarbonShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <SkipToContent />
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <Header aria-label="HotelsVendors Dashboard">
            <HeaderName href="/dashboard" prefix="">
              HotelsVendors
            </HeaderName>

            <HeaderGlobalBar>
              <HeaderGlobalAction aria-label="Search" onClick={() => {}}>
                <Search size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction aria-label="Notifications" onClick={() => {}}>
                <Notification size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction aria-label="Cart" onClick={() => {}}>
                <ShoppingCart size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction aria-label="User profile" onClick={() => {}}>
                <UserAvatar size={20} />
              </HeaderGlobalAction>
            </HeaderGlobalBar>
          </Header>
        )}
      />

      <SideNav aria-label="Side navigation" expanded={mobileOpen}>
        <SideNavItems>
          <SideNavLink renderIcon={Dashboard} href="/dashboard">
            Dashboard
          </SideNavLink>

          <SideNavMenu title="Marketplace" renderIcon={Store}>
            <SideNavMenuItem href="/dashboard/hotel">Browse Catalog</SideNavMenuItem>
            <SideNavMenuItem href="/dashboard/supplier">Supplier Directory</SideNavMenuItem>
            <SideNavMenuItem href="/dashboard/orders">Orders</SideNavMenuItem>
          </SideNavMenu>

          <SideNavLink renderIcon={Document} href="/dashboard/invoices">
            Transactions Ledger
          </SideNavLink>

          <SideNavLink renderIcon={CurrencyDollar} href="/dashboard/factoring">
            Credit Lines
          </SideNavLink>

          <SideNavLink renderIcon={ShieldAlert} href="/dashboard/eta">
            Compliance Logs
          </SideNavLink>
        </SideNavItems>
      </SideNav>

      <Content
        id="main-content"
        style={{
          marginLeft: "256px",
          padding: "24px",
          backgroundColor: "#f8fafc",
          minHeight: "calc(100vh - 48px)",
        }}
      >
        {/* Role badge bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
            padding: "12px 16px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e3e8ee",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#635bff",
                backgroundColor: "#ededff",
                padding: "4px 10px",
                borderRadius: "4px",
              }}
            >
              {roleLabel}
            </span>
            {tenantName && (
              <span style={{ fontSize: "13px", color: "#525f7f" }}>
                {tenantName}
              </span>
            )}
          </div>
          {userName && (
            <span style={{ fontSize: "13px", color: "#525f7f" }}>
              {userName}
            </span>
          )}
        </div>

        {children}
      </Content>
    </div>
  );
}
