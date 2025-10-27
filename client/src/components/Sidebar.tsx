import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  LayoutTemplate,
  Crown,
  CreditCard,
  Menu,
  X,
  FileText,
  Settings,
  BarChart3,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  isSubscribed: boolean;
  setLocation: (path: string) => void;
}

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create-invoice", label: "Create Invoice", icon: FileText },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/LayoutTemplate", label: "Template", icon: LayoutTemplate },
];

const Sidebar: React.FC<SidebarProps> = ({ isSubscribed, setLocation }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // start collapsed
  const [pathname] = useLocation();

  const menuTextClasses = (isCollapsed: boolean) =>
    `text-sm font-medium whitespace-nowrap transition-all duration-300 ${
      isCollapsed ? "opacity-0 hidden" : "opacity-100 delay-100"
    }`;

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col justify-between
        border-r border-gray-300/30 dark:border-gray-700/50
        bg-gradient-to-b from-gray-100/70 to-gray-200/40
        dark:from-gray-900/30 dark:to-gray-950/30
        backdrop-blur-lg shadow-lg transition-all duration-300
        ${isCollapsed ? "w-[80px]" : "w-60"}`}
      onMouseEnter={() => setIsCollapsed(false)} // expand on hover
      onMouseLeave={() => setIsCollapsed(true)} // collapse on mouse leave
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Menu
            className={`size-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
              isCollapsed ? "rotate-0" : "rotate-90"
            }`}
          />
          {/* {!isCollapsed && (
            <div className="flex flex-col">
              <p className="font-bold text-lg text-gray-800 dark:text-gray-100 tracking-tight">
                InvoicePro
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Smart Billing Made Easy
              </span>
            </div>
          )} */}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <div
              key={item.href}
              className={`flex items-center gap-3 px-3 py-2 my-1 rounded-xl cursor-pointer
                transition-all duration-300 ${
                  isActive
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/40"
                } ${isCollapsed ? "justify-center" : ""}`}
              onClick={() => setLocation(item.href)}
            >
              <item.icon
                className={`size-5 ${
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500"
                }`}
              />
              <p className={menuTextClasses(isCollapsed)}>{item.label}</p>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-300/30 dark:border-gray-700/50 space-y-2">
        {!isSubscribed ? (
          <div
            onClick={() => setLocation("/subscription")}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all
              bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-600
              ${isCollapsed ? "justify-center" : ""}`}
          >
            <Crown className="size-5" />
            <p className={menuTextClasses(isCollapsed)}>Upgrade to Pro</p>
          </div>
        ) : (
          <div
            onClick={() => setLocation("/subscription")}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all
              hover:bg-gray-200/50 dark:hover:bg-gray-800/40
              ${isCollapsed ? "justify-center" : ""}`}
          >
            <CreditCard className="size-5 text-gray-500" />
            <p className={menuTextClasses(isCollapsed)}>Subscription</p>
          </div>
        )}

        <div
          onClick={() => setLocation("/settings")}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all hover:bg-gray-200/50 dark:hover:bg-gray-800/40 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <Settings className="size-5 text-gray-500" />
          <p className={menuTextClasses(isCollapsed)}>Settings</p>
        </div>

        <div
          onClick={() => setLocation("/help")}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all hover:bg-gray-200/50 dark:hover:bg-gray-800/40 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <HelpCircle className="size-5 text-gray-500" />
          <p className={menuTextClasses(isCollapsed)}>Help</p>
        </div>

        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all hover:bg-red-100 dark:hover:bg-red-900/20 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="size-5 text-red-500" />
          {!isCollapsed && (
            <button
              onClick={() => (window.location.href = "/auth/logout")}
              data-testid="button-logout"
              className="text-red-500 text-sm font-medium"
            >
              Signout
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
