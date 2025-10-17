import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { getAssetStats, getRecentActivity } = useAppContext();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [statsResult, activityResult] = await Promise.all([
        getAssetStats(),
        getRecentActivity(5),
      ]);

      if (statsResult.success) {
        setStats(statsResult.data);
      }
      if (activityResult.success) {
        setRecentActivity(activityResult.data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">
            Overview of IT assets and their status.
          </p>
        </div>
        <button
          onClick={() => navigate("/assets/add")}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span className="text-xl">+</span>
          <span>Add Asset</span>
        </button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <div className="text-slate-400 text-sm mb-2">
                Network Switches
              </div>
              <div className="text-white text-4xl font-bold">
                {stats.networkSwitches || 0}
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <div className="text-slate-400 text-sm mb-2">Wireless APs</div>
              <div className="text-white text-4xl font-bold">
                {stats.wirelessAPs || 0}
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <div className="text-slate-400 text-sm mb-2">Desktops</div>
              <div className="text-white text-4xl font-bold">
                {stats.desktops || 0}
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <div className="text-slate-400 text-sm mb-2">Laptops</div>
              <div className="text-white text-4xl font-bold">
                {stats.laptops || 0}
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm mb-2">In Use</div>
                <div className="text-white text-4xl font-bold">
                  {stats.inUse || 0}
                </div>
              </div>
              <div className="text-4xl">💻</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm mb-2">In Stock</div>
                <div className="text-white text-4xl font-bold">
                  {stats.inStock || 0}
                </div>
              </div>
              <div className="text-4xl">📦</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm mb-2">
                  Under Maintenance
                </div>
                <div className="text-white text-4xl font-bold">
                  {stats.underMaintenance || 0}
                </div>
              </div>
              <div className="text-4xl">🔧</div>
            </div>
          </div>
        </>
      )}

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
                  <td className="px-6 py-4 text-slate-300">{activity.user}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        activity.status === "Active"
                          ? "bg-blue-600/20 text-blue-400"
                          : activity.status === "In Stock"
                          ? "bg-green-600/20 text-green-400"
                          : "bg-yellow-600/20 text-yellow-400"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
