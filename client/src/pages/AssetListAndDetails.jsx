import { useState } from "react";
import { Search, Filter, X, BarChart3, Users, Package } from "lucide-react";

export default function AssetListAndDetails() {
  const [activeMenu, setActiveMenu] = useState("Assets");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const assets = [
    {
      id: "A1234",
      type: "Laptop",
      model: "Model X",
      status: "Active",
      statusColor: "green",
      assignedTo: "Ethan Carter",
      serialNumber: "SN123456789",
      purchaseDate: "2022-01-15",
      warrantyExpiry: "2024-01-15",
    },
    {
      id: "B5678",
      type: "Desktop",
      model: "Model Y",
      status: "Inactive",
      statusColor: "red",
      assignedTo: "Office A",
      serialNumber: "SN987654321",
      purchaseDate: "2021-03-20",
      warrantyExpiry: "2023-03-20",
    },
    {
      id: "C9012",
      type: "Monitor",
      model: "Model Z",
      status: "Active",
      statusColor: "green",
      assignedTo: "Sophia Clark",
      serialNumber: "SN456789123",
      purchaseDate: "2022-06-10",
      warrantyExpiry: "2024-06-10",
    },
    {
      id: "D3456",
      type: "Printer",
      model: "Model P",
      status: "Maintenance",
      statusColor: "yellow",
      assignedTo: "Office B",
      serialNumber: "SN789123456",
      purchaseDate: "2020-11-05",
      warrantyExpiry: "2022-11-05",
    },
    {
      id: "E7890",
      type: "Server",
      model: "Model S",
      status: "Active",
      statusColor: "green",
      assignedTo: "Data Center",
      serialNumber: "SN321654987",
      purchaseDate: "2021-08-15",
      warrantyExpiry: "2024-08-15",
    },
    {
      id: "F1234",
      type: "Laptop",
      model: "Model X",
      status: "Active",
      statusColor: "green",
      assignedTo: "Liam Walker",
      serialNumber: "SN654987321",
      purchaseDate: "2022-09-20",
      warrantyExpiry: "2024-09-20",
    },
  ];

  const maintenanceHistory = [
    {
      title: "Software Update",
      description: "Performed by IT Support on 2023-06-15",
      date: "2023-06-15",
    },
    {
      title: "Hardware Check",
      description: "Performed by IT Support on 2023-01-15",
      date: "2023-01-15",
    },
    {
      title: "Initial Setup",
      description: "Performed by IT Support on 2022-07-01",
      date: "2022-07-01",
    },
  ];

  const menuItems = [
    { name: "Dashboard", icon: Package },
    { name: "Assets", icon: Package },
    { name: "Users", icon: Users },
    { name: "Reports", icon: BarChart3 },
  ];

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
  };

  const handleCloseDetails = () => {
    setSelectedAsset(null);
  };

  const handleEditDetails = () => {
    console.log("Edit details clicked");
  };

  const handleChangeStatus = () => {
    console.log("Change status clicked");
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded"></div>
            <span className="text-white font-bold text-lg">AssetTrack</span>
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

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-medium">
              EC
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">
                Ethan Carter
              </div>
              <div className="text-slate-400 text-xs truncate">
                ethan.carter@example.com
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Asset List */}
        <div
          className={`flex-1 flex flex-col border-r border-slate-800 ${
            selectedAsset ? "w-2/3" : "w-full"
          }`}
        >
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 p-6">
            <h1 className="text-2xl font-bold text-white mb-4">All Assets</h1>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-2">
                <Filter size={18} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-slate-900 border-b border-slate-800">
                <tr>
                  <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">
                    Asset ID
                  </th>
                  <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">
                    Type
                  </th>
                  <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">
                    Model
                  </th>
                  <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">
                    Assigned To
                  </th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => handleAssetClick(asset)}
                    className={`border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      selectedAsset?.id === asset.id ? "bg-slate-800/50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {asset.id}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{asset.type}</td>
                    <td className="px-6 py-4 text-slate-300">{asset.model}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          asset.statusColor === "green"
                            ? "bg-green-600/20 text-green-400"
                            : asset.statusColor === "red"
                            ? "bg-red-600/20 text-red-400"
                            : "bg-yellow-600/20 text-yellow-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            asset.statusColor === "green"
                              ? "bg-green-400"
                              : asset.statusColor === "red"
                              ? "bg-red-400"
                              : "bg-yellow-400"
                          }`}
                        ></span>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {asset.assignedTo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Asset Details Panel */}
        {selectedAsset && (
          <div className="w-96 bg-slate-900 flex flex-col">
            {/* Details Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Asset Details</h2>
              <button
                onClick={handleCloseDetails}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Details Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Specifications */}
              <div>
                <h3 className="text-white font-semibold mb-4">
                  Specifications
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Asset ID</span>
                    <span className="text-white font-medium">
                      {selectedAsset.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type</span>
                    <span className="text-white font-medium">
                      {selectedAsset.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Model</span>
                    <span className="text-white font-medium">
                      {selectedAsset.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Serial Number</span>
                    <span className="text-white font-medium">
                      {selectedAsset.serialNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Purchase Date</span>
                    <span className="text-white font-medium">
                      {selectedAsset.purchaseDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Warranty Expiry</span>
                    <span className="text-white font-medium">
                      {selectedAsset.warrantyExpiry}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-white font-semibold mb-4">Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Current Status</span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        selectedAsset.statusColor === "green"
                          ? "bg-green-600/20 text-green-400"
                          : selectedAsset.statusColor === "red"
                          ? "bg-red-600/20 text-red-400"
                          : "bg-yellow-600/20 text-yellow-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          selectedAsset.statusColor === "green"
                            ? "bg-green-400"
                            : selectedAsset.statusColor === "red"
                            ? "bg-red-400"
                            : "bg-yellow-400"
                        }`}
                      ></span>
                      {selectedAsset.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned User</span>
                    <span className="text-white font-medium">
                      {selectedAsset.assignedTo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Updated</span>
                    <span className="text-white font-medium">2023-11-20</span>
                  </div>
                </div>
              </div>

              {/* Maintenance History */}
              <div>
                <h3 className="text-white font-semibold mb-4">
                  Maintenance History
                </h3>
                <div className="space-y-4">
                  {maintenanceHistory.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                        {index < maintenanceHistory.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-700 mt-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="text-white font-medium mb-1">
                          {item.title}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-slate-800 flex gap-3">
              <button
                onClick={handleEditDetails}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Edit Details
              </button>
              <button
                onClick={handleChangeStatus}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                Change Status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
