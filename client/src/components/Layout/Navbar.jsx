import { Bell, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAppContext();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex justify-between items-center">
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
        </button>
        <div className="relative group">
          <button className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-600 transition-colors">
            <User size={20} />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div className="p-3 border-b border-slate-700">
              <div className="text-white text-sm font-medium">{user?.name}</div>
              <div className="text-slate-400 text-xs">{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
