import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import useStore from "@/store/useStore";
import Sidebar from "@/components/Sidebar";

const routeTitles: Record<string, string> = {
  "/": "项目总览",
  "/plan": "计划采购",
  "/arrival": "到货验收",
  "/material": "领退料",
  "/contract": "合同费用",
  "/cost": "成本分析",
};

const roles = ["物资经理", "项目仓库", "分包队伍"] as const;

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { currentRole, setCurrentRole, sidebarCollapsed } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageTitle = routeTitles[location.pathname] || "物资管理系统";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Sidebar />

      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-[220px]"
        )}
      >
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <h1 className="text-lg font-semibold text-[#1B3A5C]">{pageTitle}</h1>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200 text-sm text-gray-600"
            >
              <User size={16} className="text-[#1B3A5C]" />
              <span>{currentRole}</span>
              <ChevronDown
                size={14}
                className={cn(
                  "transition-transform duration-200",
                  dropdownOpen && "rotate-180"
                )}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm transition-colors duration-150",
                      currentRole === role
                        ? "bg-[#1B3A5C]/10 text-[#1B3A5C] font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <main className="p-6 overflow-auto" style={{ height: "calc(100vh - 56px)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
