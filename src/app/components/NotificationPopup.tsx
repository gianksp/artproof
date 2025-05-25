"use client";

import { useEffect } from "react";

export type NotificationType = "success" | "error";

interface NotificationPopupProps {
  open: boolean;
  onClose: () => void;
  type: NotificationType;
  message: string;
  link?: string;
}

export default function NotificationPopup({
  open,
  onClose,
  type,
  message,
  link,
}: NotificationPopupProps) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 8000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-lg p-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {type === "success" ? "✅" : "⚠️"}
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-800 font-semibold">
            {type === "success" ? "Success" : "Error"}
          </p>
          <p className="text-sm text-gray-600">{message}</p>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
            >
              View on Snowtrace
            </a>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
