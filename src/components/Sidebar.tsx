import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  Package,
  FileText,
  BarChart3,
  HardHat,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useStore from "@/store/useStore";

const navItems = [
  { icon: LayoutDashboard, label: "项目总览", path: "/" },
  { icon: ClipboardList, label: "计划采购", path: "/plan" },
  { icon: Truck, label: "到货验收", path: "/arrival" },
  { icon: Package, label: "领退料", path: "/material" },
  { icon: FileText, label: "合同费用", path: "/contract" },
  { icon: BarChart3, label: "成本分析", path: "/cost" },
];

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#2C3E50] flex flex-col transition-all duration-300 z-50",
        sidebarCollapsed ? "w-16" : "w-[220px]"
      )}
    >
      <div className="flex items-center h-16 px-4 border-b border-white/10 shrink-0">
        <HardHat className="text-[#E67E22] shrink-0" size={28} />
        {!sidebarCollapsed && (
          <span className="ml-3 text-white font-semibold text-base tracking-wide whitespace-nowrap">
            物资管理系统
          </span>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center h-11 mx-2 my-0.5 rounded-md transition-colors duration-200 relative",
                sidebarCollapsed ? "justify-center px-0" : "px-3",
                isActive
                  ? "bg-white/15 text-white border-l-[3px] border-[#E67E22]"
                  : "text-gray-300 hover:bg-white/10 hover:text-white border-l-[3px] border-transparent"
              )
            }
          >
            <item.icon size={20} className="shrink-0" />
            {!sidebarCollapsed && (
              <span className="ml-3 text-sm whitespace-nowrap">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-2">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex items-center justify-center w-full h-10 rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-colors duration-200"
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
}
