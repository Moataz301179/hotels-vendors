import { AppSidebar } from "@/components/app/sidebar";
import { AppHeader } from "@/components/app/header";
import { RoleProvider } from "@/components/app/role-context";
import { CartProvider } from "@/components/app/cart-context";
import { ToastProvider } from "@/components/app/toast";
import { CartSidebar } from "@/components/app/cart-sidebar";
import { AuthProvider } from "@/components/app/auth-context";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <RoleProvider>
        <ToastProvider>
          <CartProvider>
            <div className="min-h-screen bg-background">
              <AppSidebar />
              <div className="ml-56">
                <AppHeader />
                <main className="pt-11 min-h-screen">
                  <div className="p-4">{children}</div>
                </main>
              </div>
              <CartSidebar />
            </div>
          </CartProvider>
        </ToastProvider>
      </RoleProvider>
    </AuthProvider>
  );
}
