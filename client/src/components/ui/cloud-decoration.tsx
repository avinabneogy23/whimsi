import React from "react";
import { cn } from "@/lib/utils";

interface CloudDecorationProps {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  opacity?: number;
  delay?: number;
}

export function CloudDecoration({
  className,
  style,
  color = "#89B9D9",
  opacity = 0.3,
  delay = 0
}: CloudDecorationProps) {
  return (
    <div 
      className={cn("cloud-decoration animate-float", className)}
      style={{ 
        ...style,
        animationDelay: `${delay}s` 
      }}
    >
      <svg 
        viewBox="0 0 100 50" 
        xmlns="http://www.w3.org/2000/svg" 
        fill={color} 
        opacity={opacity}
      >
        <path d="M10 30 Q20 15 30 30 Q40 10 50 30 Q60 20 70 30 Q80 15 90 30 Q95 35 90 40 Q80 50 50 50 Q20 50 10 40 Q5 35 10 30Z" />
      </svg>
    </div>
  );
}

export function CloudDecorations() {
  return (
    <>
      <CloudDecoration 
        className="top-10 left-10 w-32 h-20" 
        color="#89B9D9"
        delay={0}
      />
      <CloudDecoration 
        className="top-40 right-10 w-28 h-16" 
        color="#C8B6E2"
        delay={2}
      />
      <CloudDecoration 
        className="bottom-40 left-20 w-24 h-14" 
        color="#F7C59F"
        delay={1}
      />
      <CloudDecoration 
        className="top-60 left-1/2 w-36 h-20" 
        color="#A0C8B3"
        delay={3}
      />
    </>
  );
}
