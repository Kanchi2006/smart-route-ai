import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  History,
  Settings,
  LogOut,
  Zap,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/history", label: "History", icon: History },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl glass-card"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col
          bg-[#0e0c16]/80 backdrop-blur-2xl border-r border-white/[0.06]
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[72px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 shrink-0 border-b border-white/[0.06]">
          <div className="size-9 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.35)] shrink-0">
            <Zap className="size-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-display font-semibold text-[15px] tracking-tight whitespace-nowrap">
              SmartChain AI
            </span>
          )}
          <button
            onClick={() => {
              setCollapsed((c) => !c);
              setMobileOpen(false);
            }}
            className="ml-auto p-1.5 rounded-lg hover:bg-white/[0.06] transition hidden lg:flex"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              className={`size-4 text-text-secondary transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white shadow-[0_0_24px_rgba(139,92,246,0.3)]"
                    : "text-[--text-secondary] hover:text-[--text-primary] hover:bg-white/[0.05]"
                }`
              }
            >
              <Icon className="size-[18px] shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-3 border-t border-white/[0.06]">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[--text-muted] hover:text-[--text-primary] hover:bg-white/[0.05] transition">
            <LogOut className="size-[18px] shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Spacer to push content right */}
      <div
        className={`hidden lg:block shrink-0 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[260px]"}`}
      />
    </>
  );
}
