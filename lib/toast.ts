"use client";

import { useState, useCallback } from "react";

let globalToasts: { id: string; message: string; type: "success" | "warning" | "error"; duration?: number }[] = [];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

function addToast(message: string, type: "success" | "warning" | "error", duration = 4000) {
  const id = Math.random().toString(36).slice(2);
  globalToasts = [...globalToasts, { id, message, type, duration }];
  notify();
  setTimeout(() => {
    globalToasts = globalToasts.filter((t) => t.id !== id);
    notify();
  }, duration);
}

export const toast = {
  success: (message: string, duration?: number) => addToast(message, "success", duration),
  warning: (message: string, duration?: number) => addToast(message, "warning", duration),
  error: (message: string, duration?: number) => addToast(message, "error", duration),
};

export function useGlobalToasts() {
  const [toasts, setToasts] = useState(globalToasts);

  const subscribe = useCallback(() => {
    setToasts([...globalToasts]);
  }, []);

  useState(() => {
    listeners.push(subscribe);
    return () => {
      listeners = listeners.filter((l) => l !== subscribe);
    };
  });

  const dismiss = useCallback((id: string) => {
    globalToasts = globalToasts.filter((t) => t.id !== id);
    notify();
  }, []);

  return { toasts, dismiss };
}
