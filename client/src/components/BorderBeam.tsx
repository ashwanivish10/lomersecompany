import { cn } from "@/lib/utils";
import React from "react";

export const BorderBeam = ({
  className,
  children,
  duration = 10,
  borderWidth = 1.5,
  colorFrom = "hsl(var(--primary))",
  colorTo = "hsl(var(--primary) / 0.1)",
}: {
  className?: string;
  children: React.ReactNode;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
}) => {
  return (
    <div
      style={
        {
          "--duration": `${duration}s`,
          "--border-width": `${borderWidth}px`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
        } as React.CSSProperties
      }
      className={cn(
        "relative rounded-[--radius] p-[--border-width] bg-background",
        className
      )}
    >
      {/* Beam effect */}
      <div className="absolute inset-0 rounded-[--radius] [border:calc(var(--border-width)*1.2)_solid_transparent] 
                     bg-[conic-gradient(from_var(--angle),var(--color-to)_0%,var(--color-from)_10%,var(--color-to)_20%)] 
                     bg-[length:100%_100%] bg-[0_0] 
                     animate-border-beam" 
      />
      {/* Content */}
      <div className="relative z-10 rounded-[--radius] bg-background">
          {children}
      </div>

      {/* Style tag for the keyframe animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @property --angle {
            syntax: "<angle>";
            inherits: false;
            initial-value: 0deg;
        }
        @keyframes border-beam {
            from { --angle: 0deg; }
            to { --angle: 360deg; }
        }
        .animate-border-beam {
            animation: border-beam var(--duration) linear infinite;
        }
      `}} />
    </div>
  );
};
