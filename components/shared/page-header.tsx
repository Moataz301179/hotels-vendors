"use client";

import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: string[];
  action?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumb, action }: PageHeaderProps) {
  return (
    <div className="mb-8 command-panel p-5 sm:p-6">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="mb-3 flex items-center gap-2 text-sm text-white/45">
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-4 w-4" />}
              <span className={i === breadcrumb.length - 1 ? "text-white" : ""}>{item}</span>
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-[30px]">{title}</h1>
          {description && <p className="mt-1 text-sm text-white/55">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
