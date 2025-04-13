import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ToastNotificationProps {
  message: string;
  icon?: React.ReactNode;
  duration?: number;
  onClose?: () => void;
  isVisible: boolean;
}

export function ToastNotification({
  message,
  icon,
  duration = 3000,
  onClose,
  isVisible
}: ToastNotificationProps) {
  const [visible, setVisible] = useState(isVisible);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setVisible(isVisible);
    
    if (isVisible) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      
      timerRef.current = window.setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
    }
    
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [isVisible, duration, onClose]);

  return (
    <div 
      className={cn(
        "fixed bottom-24 left-1/2 -translate-x-1/2 glass-effect px-4 py-3 rounded-full shadow-soft flex items-center z-50 transition-transform duration-500",
        visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      )}
    >
      {icon ? (
        <div className="w-8 h-8 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-2">
          {icon}
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      )}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
