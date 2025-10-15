import { useState } from "react";
import {
  Bell,
  User,
  Laptop,
  Settings,
  BarChart3,
  Users,
  Package,
} from "lucide-react";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const stats = [
    { label: "Network Switches", value: "150" },
    { label: "Wireless APs", value: "200" },
    { label: "Desktops", value: "300" },
    { label: "Laptops", value: "250" },
  ];

  const statusCards = [
    { label: "In Use", value: "700", icon: "💻", color: "blue" },
    { label: "In Stock", value: "150", icon: "📦", color: "green" },
    { label: "Under Maintenance", value: "50", icon: "🔧", color: "yellow" },
  ];

  const recentActivity = [
    {
      asset: "Switch 123",
      user: "Ethan Carter",
      status: "Assigned",
      date: "2024-01-15",
      statusColor: "blue",
    },
    {
      asset: "WAP 456",
      user: "Olivia Bennett",
      status: "In Stock",
      date: "2024-01-20",
      statusColor: "green",
    },
    {
      asset: "Desktop 789",
      user: "Noah Thompson",
      status: "Under Maintenance",
      date: "2024-02-01",
      statusColor: "yellow",
    },
    {
      asset: "Laptop 101",
      user: "Ava Harper",
      status: "Assigned",
      date: "2024-02-10",
      statusColor: "blue",
    },
    {
      asset: "Switch 112",
      user: "Liam Foster",
      status: "Assigned",
      date: "2024-02-15",
      statusColor: "blue",
    },
  ];

  const menuItems = [
    { name: "Dashboard", icon: Package },
    { name: "Assets", icon: Package },
    { name: "Users", icon: Users },
    { name: "Reports", icon: BarChart3 },
    { name: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded"></div>
            <span className="text-white font-bold text-lg">Asset Tracker</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeMenu === item.name
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex justify-between items-center">
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-600 transition-colors">
              <User size={20} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-slate-400">
                Overview of IT assets and their status.
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
              <span className="text-xl">+</span>
              <span>Add Asset</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6"
              >
                <div className="text-slate-400 text-sm mb-2">{stat.label}</div>
                <div className="text-white text-4xl font-bold">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statusCards.map((card, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 flex items-center justify-between"
              >
                <div>
                  <div className="text-slate-400 text-sm mb-2">
                    {card.label}
                  </div>
                  <div className="text-white text-4xl font-bold">
                    {card.value}
                  </div>
                </div>
                <div className="text-4xl">{card.icon}</div>
              </div>
            ))}
          </div>

          {/* Recent Activity Table */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">
                      ASSET
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">
                      USER
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">
                      STATUS
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">
                      DATE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-white">{activity.asset}</td>
                      <td className="px-6 py-4 text-slate-300">
                        {activity.user}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            activity.statusColor === "blue"
                              ? "bg-blue-600/20 text-blue-400"
                              : activity.statusColor === "green"
                              ? "bg-green-600/20 text-green-400"
                              : "bg-yellow-600/20 text-yellow-400"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {activity.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
