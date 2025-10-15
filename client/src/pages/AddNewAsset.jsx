import { useState } from "react";
import { User } from "lucide-react";

export default function AddNewAsset() {
  const [formData, setFormData] = useState({
    assetType: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    cost: "",
    warrantyExpiryDate: "",
    initialStatus: "",
  });

  const assetTypes = [
    "Laptop",
    "Desktop",
    "Monitor",
    "Printer",
    "Server",
    "Network Switch",
    "Wireless AP",
    "Router",
  ];
  const statusOptions = ["Active", "In Stock", "Under Maintenance", "Inactive"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Add your submit logic here
  };

  const handleCancel = () => {
    console.log("Form cancelled");
    // Add your cancel logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Navigation */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center justify-between px-8 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded"></div>
            <span className="text-white font-bold text-lg">Asset Tracker</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <button className="text-slate-400 hover:text-white transition-colors">
              Dashboard
            </button>
            <button className="text-blue-400 font-medium">Assets</button>
            <button className="text-slate-400 hover:text-white transition-colors">
              Reports
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              Settings
            </button>
          </div>

          {/* User Icon */}
          <button className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-600 transition-colors">
            <User size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Add New Asset</h1>
          <p className="text-slate-400">
            Fill in the details below to add a new IT asset to the inventory.
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset Type */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Asset Type
              </label>
              <select
                name="assetType"
                value={formData.assetType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">
                  Select Asset Type
                </option>
                {assetTypes.map((type) => (
                  <option key={type} value={type} className="bg-slate-900">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Manufacturer
              </label>
              <input
                type="text"
                name="manufacturer"
                placeholder="e.g. Dell"
                value={formData.manufacturer}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Model
              </label>
              <input
                type="text"
                name="model"
                placeholder="e.g. XPS 15"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Serial Number
              </label>
              <input
                type="text"
                name="serialNumber"
                placeholder="Enter serial number"
                value={formData.serialNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Purchase Date
              </label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                placeholder="mm/dd/yyyy"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Cost */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Cost
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500">
                  $
                </span>
                <input
                  type="number"
                  name="cost"
                  placeholder="0.00"
                  value={formData.cost}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Warranty Expiry Date */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Warranty Expiry Date
              </label>
              <input
                type="date"
                name="warrantyExpiryDate"
                value={formData.warrantyExpiryDate}
                onChange={handleChange}
                placeholder="mm/dd/yyyy"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Initial Status */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Initial Status
              </label>
              <select
                name="initialStatus"
                value={formData.initialStatus}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">
                  Select Initial Status
                </option>
                {statusOptions.map((status) => (
                  <option key={status} value={status} className="bg-slate-900">
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-700/50">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-600/20"
            >
              Add Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
