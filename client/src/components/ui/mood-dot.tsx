import { MouseEvent } from "react";
import { cn } from "@/lib/utils";

type MoodDotProps = {
  mood: string;
  icon: string;
  color: string;
  backgroundColor: string;
  isSelected?: boolean;
  onClick?: (mood: string) => void;
};

export function MoodDot({
  mood,
  icon,
  color,
  backgroundColor,
  isSelected = false,
  onClick,
}: MoodDotProps) {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick(mood);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={cn(
          "mood-dot w-12 h-12 rounded-full flex items-center justify-center shadow-soft cursor-pointer",
          isSelected && "ring-2 ring-primary",
          backgroundColor
        )}
        onClick={handleClick}
      >
        <i className={`ri-${icon} text-xl ${color}`}></i>
      </div>
      <span className="text-xs font-medium text-gray-600">
        {mood.charAt(0).toUpperCase() + mood.slice(1)}
      </span>
    </div>
  );
}
