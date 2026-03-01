import {
  Activity,
  FlaskConical,
  LayoutDashboard,
  Leaf,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

type Page = "dashboard" | "energy" | "carbon" | "batch";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: {
  id: Page;
  label: string;
  icon: React.ElementType;
  sublabel: string;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    sublabel: "Overview",
  },
  {
    id: "energy",
    label: "Energy Analytics",
    icon: Zap,
    sublabel: "Patterns & Anomalies",
  },
  {
    id: "carbon",
    label: "Carbon Intelligence",
    icon: Leaf,
    sublabel: "Emissions Tracking",
  },
  {
    id: "batch",
    label: "Batch Simulator",
    icon: FlaskConical,
    sublabel: "Parameter Testing",
  },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <nav
      className="fixed left-0 top-0 h-full w-60 flex flex-col z-40"
      style={{
        background: "rgba(17, 24, 39, 0.97)",
        borderRight: "1px solid rgba(59, 130, 246, 0.15)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <div className="p-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm font-mono"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
            }}
          >
            GS
          </div>
          <div>
            <div className="text-gradient-blue font-bold text-base leading-none">
              Golden Signature
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Manufacturing AI
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        <div className="px-3 py-2">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
            Navigation
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group"
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.05) 100%)",
                      borderLeft: "3px solid #3b82f6",
                      paddingLeft: "9px",
                    }
                  : {}
              }
              whileHover={{ x: isActive ? 0 : 3 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                  isActive
                    ? "text-blue-400"
                    : "text-slate-500 group-hover:text-blue-400"
                }`}
                style={
                  isActive
                    ? { filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 0.8))" }
                    : {}
                }
              />
              <div>
                <div
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-blue-300"
                      : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </div>
                <div className="text-xs text-slate-600 group-hover:text-slate-500 transition-colors duration-200">
                  {item.sublabel}
                </div>
              </div>

              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
                  style={{ boxShadow: "0 0 6px rgba(59, 130, 246, 0.8)" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* AI Engine Status */}
      <div
        className="m-3 p-3 rounded-xl"
        style={{
          background: "rgba(16, 185, 129, 0.06)",
          border: "1px solid rgba(16, 185, 129, 0.15)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            <div
              className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 opacity-40"
              style={{
                animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
              }}
            />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-400">
              AI Engine: Active
            </div>
            <div className="text-xs text-slate-600">
              NSGA-II optimizer running
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Activity className="w-3 h-3 text-slate-600" />
          <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #10b981, #34d399)" }}
              initial={{ width: "0%" }}
              animate={{ width: "78%" }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            />
          </div>
          <span className="text-xs text-slate-500 font-mono">78%</span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 pt-0 border-t border-white/5 mt-1">
        <div className="text-xs text-slate-600 text-center">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </nav>
  );
}
