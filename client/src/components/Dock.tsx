"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

// --- YEH FUNCTION AB MOUSE KE 'Y' (VERTICAL) POSITION PAR KAAM KARTA HAI ---
function useDockItemSize(
  mouseY: MotionValue<number>,
  baseItemSize: number,
  magnification: number,
  distance: number,
  ref: React.RefObject<HTMLDivElement>,
  spring: { mass: number; stiffness: number; damping: number }
) {
  const mouseDistance = useTransform(mouseY, (val) => {
    if (typeof val !== "number" || isNaN(val)) return 0;
    const rect = ref.current?.getBoundingClientRect() ?? { y: 0, height: baseItemSize };
    return val - rect.y - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  return useSpring(targetSize, spring);
}

interface DockItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  mouseY: MotionValue<number>;
  baseItemSize: number;
  magnification: number;
  distance: number;
  spring: { mass: number; stiffness: number; damping: number };
  badgeCount?: number;
  isActive: boolean;
}

function DockItem({ icon, label, onClick, mouseY, baseItemSize, magnification, distance, spring, badgeCount, isActive }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);
  const size = useDockItemSize(mouseY, baseItemSize, magnification, distance, ref, spring);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (value) => setShowLabel(value === 1));
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full cursor-pointer
        bg-white/50 dark:bg-black/20 backdrop-blur-md shadow-lg border border-gray-300/50 dark:border-gray-700/50
        transition-colors duration-200 ${isActive ? 'bg-primary/20 border-primary/50' : ''}`}
      tabIndex={0}
      role="button"
    >
      <div className={`transition-transform duration-200 ${showLabel ? 'scale-110' : 'scale-100'}`}>{icon}</div>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-full ml-4 top-1/2 w-fit whitespace-pre rounded-md
              border border-gray-300/50 dark:border-gray-700/50 bg-white/80 dark:bg-black/50 px-2 py-1 text-xs text-foreground shadow-md"
            style={{ y: "-50%" }}
            role="tooltip"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export interface DockItemData {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  badgeCount?: number;
  href: string;
}

interface DockProps {
  items: DockItemData[];
  className?: string;
  spring?: { mass: number; stiffness: number; damping: number };
  magnification?: number;
  distance?: number;
  baseItemSize?: number;
}

export default function Dock({
  items = [],
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 60,
  distance = 150,
  baseItemSize = 44,
}: DockProps) {
  const mouseY = useMotionValue(Infinity);
  const [pathname] = useLocation();

  // --- YEH HAI FIX: Back button ab 'window.history.back()' use karega ---
  const backButton: DockItemData | null =
    pathname !== '/'
      ? {
          icon: <ArrowLeft className="size-5" />,
          label: "Go Back",
          onClick: () => window.history.back(), // Browser ki back functionality
          href: "#back",
        }
      : null;

  const allItems = backButton ? [backButton, ...items] : items;
  // --------------------------------------------------------------------

  return (
    <motion.div
      onMouseMove={(e) => mouseY.set(e.pageY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      className={`fixed left-4 top-1/2 -translate-y-1/2 flex flex-col items-center
        w-16 gap-3 rounded-2xl border border-gray-300/50 dark:border-gray-700/50
        bg-white/30 dark:bg-black/20 backdrop-blur-xl
        py-4 px-3 shadow-2xl z-50 ${className}`}
      role="toolbar"
    >
      {allItems.map((item, index) => (
        <DockItem
          key={index}
          {...item}
          mouseY={mouseY}
          baseItemSize={baseItemSize}
          magnification={magnification}
          distance={distance}
          spring={spring}
          isActive={pathname === item.href}
        />
      ))}
    </motion.div>
  );
}

