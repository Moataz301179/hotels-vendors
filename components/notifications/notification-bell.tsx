"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Info,
  AlertTriangle,
  AlertCircle,
  ShoppingCart,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications, type Notification, type NotificationType } from "./notification-context";

const TYPE_ICON: Record<NotificationType, React.ReactNode> = {
  info: <Info size={14} className="text-blue-400" />,
  success: <CheckCircle2 size={14} className="text-emerald-400" />,
  warning: <AlertTriangle size={14} className="text-amber-400" />,
  error: <AlertCircle size={14} className="text-red-400" />,
  order: <ShoppingCart size={14} className="text-accent-base" />,
  message: <MessageSquare size={14} className="text-cyan-400" />,
};

const TYPE_BG: Record<NotificationType, string> = {
  info: "bg-blue-400/10",
  success: "bg-emerald-400/10",
  warning: "bg-amber-400/10",
  error: "bg-red-400/10",
  order: "bg-accent-base/20",
  message: "bg-cyan-400/10",
};

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-EG", {
    month: "short",
    day: "numeric",
  });
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDismiss,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex gap-3 p-3 rounded-xl border transition-colors ${
        notification.read
          ? "bg-transparent border-transparent hover:bg-[#F8FAFC]"
          : "bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]"
      }`}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <span className="absolute top-3.5 left-3 w-1.5 h-1.5 rounded-full bg-accent-base ring-2 ring-white" />
      )}

      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${TYPE_BG[notification.type]}`}>
        {TYPE_ICON[notification.type]}
      </div>

      <div className="flex-1 min-w-0 pl-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-xs font-medium leading-snug ${notification.read ? "text-[#475569]" : "text-[#0F172A]"}`}>
            {notification.title}
          </p>
          <span className="text-[10px] text-[#64748B] flex-shrink-0 mt-0.5">
            {formatTimeAgo(notification.timestamp)}
          </span>
        </div>
        <p className="text-[11px] text-[#64748B] leading-snug mt-0.5 line-clamp-2">
          {notification.message}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.read && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            aria-label="Mark as read"
          >
            <Check size={12} />
          </button>
        )}
        <button
          onClick={() => onDismiss(notification.id)}
          className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
          aria-label="Dismiss notification"
        >
          <X size={12} />
        </button>
      </div>
    </motion.div>
  );
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const recentNotifications = notifications.slice(0, 20);

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={18} />
        {/* Demo red dot */}
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-base ring-2 ring-white" />
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-[24rem] rounded-2xl border border-[#E2E8F0] bg-white/95 backdrop-blur-2xl shadow-2xl shadow-black/40 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-[#64748B]" />
                <span className="text-sm font-semibold text-[#0F172A]">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-accent-base/30 text-accent-base border border-accent-base/20">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors px-2 py-1 rounded-md hover:bg-[#F1F5F9]"
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 scrollbar-thin">
              <AnimatePresence mode="popLayout">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onMarkAsRead={markAsRead}
                      onDismiss={dismissNotification}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-3">
                      <Bell size={20} className="text-[#94A3B8]" />
                    </div>
                    <p className="text-sm font-medium text-[#64748B]">No notifications</p>
                    <p className="text-[11px] text-[#64748B] mt-1">
                      You&apos;ll see updates here when they arrive.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {recentNotifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-[#E2E8F0] text-center">
                <button
                  onClick={() => setOpen(false)}
                  className="text-[11px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
