"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 mb-2 text-[11px]">
          <Link
            href="/"
            className="flex items-center gap-1 text-white/25 hover:text-white/55 transition-colors"
          >
            <Home size={11} />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <div key={i} className="flex items-center gap-1">
              <ChevronRight size={11} className="text-white/10" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-white/25 hover:text-white/55 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/45">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Title Row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold text-white tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-[13px] text-white/30 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
