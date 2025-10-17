import { Link, useLocation } from "react-router-dom";
import { Package, Users, BarChart3, Settings } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAppContext();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Package },
    { name: "Assets", path: "/assets", icon: Package },
    { name: "Users", path: "/users", icon: Users },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded"></div>
          <span className="text-white font-bold text-lg">Asset Tracker</span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      {user && (
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-medium">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">
                {user.name}
              </div>
              <div className="text-slate-400 text-xs truncate">
                {user.email}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
