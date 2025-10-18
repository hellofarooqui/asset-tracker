import { useEffect, useState, useRef } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function AddAssetPage() {
  const navigate = useNavigate();
  const { addAsset, getAssetTypes, getAllManufacturers, getAssetModels } =
    useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
  const [assetTypes, setAssetTypes] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [assetModels, setAssetModels] = useState([]);
  const [filteredAssetModels, setFilteredAssetModels] = useState([]);
  const [modelFilterValue, setModelFilterValue] = useState("");
  const statusOptions = ["In Use", "In Stock", "Under Maintenance", "Retired"];

  // refs for click-outside behavior
  const modelInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // special handling for model input: keep a separate filter value
    if (name === "model") {
      if (!formData.manufacturer) {
        const selectedModel = assetModels.find((m) => m.name === value);
        setFormData((prev) => ({
          ...prev,
          manufacturer:
            manufacturers.find(
              (manu) => manu._id === selectedModel.manufacturer
            )?._id || "",
        }));
        setModelFilterValue("");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        model: value,
      }));
      return;
    }

    // when manufacturer changes, clear model-related fields
    if (name === "manufacturer") {
      setFormData((prev) => ({
        ...prev,
        manufacturer: value,
        model: "",
      }));
      setModelFilterValue("");
      setFilteredAssetModels(
        assetModels.filter((m) => m.manufacturer === value)
      );
      // assetModels will be updated by useEffect watching manufacturers or formData.manufacturer
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await addAsset({
        type: formData.assetType,
        manufacturer: formData.manufacturer,
        model: formData.model,
        serialNumber: formData.serialNumber,
        purchaseDate: formData.purchaseDate,
        cost: parseFloat(formData.cost),
        warrantyExpiry: formData.warrantyExpiryDate,
        status: formData.initialStatus,
      });

      if (result.success) {
        console.log("Asset added successfully:", result);
        navigate("/assets");
      } else {
        throw new Error(result.error || "Failed to add asset");
      }
    } catch (error) {
      // setError(error || "Failed to add asset");
      console.log("Error in adding asset",error)
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/assets");
  };

  useEffect(() => {
    const fetchAssetTypes = async () => {
      setIsLoading(true);
      const result = await getAssetTypes();
      if (result.success) {
        console.log("Fetched asset types:", result);
        setAssetTypes(result.data);
        setIsLoading(false);
      } else {
        setError(result.error || "Failed to fetch asset types");
        setIsLoading(false);
      }
    };
    const fetchManufacturers = async () => {
      setIsLoading(true);
      const result = await getAllManufacturers();
      if (result.success) {
        console.log("Fetched manufacturers:", result.data);
        setManufacturers(result.data);
        setIsLoading(false);
      } else {
        setError(result.error || "Failed to fetch manufacturers");
        setIsLoading(false);
      }
    };
    const fetchAssetModels = async () => {
      setIsLoading(true);
      const result = await getAssetModels();
      if (result.success) {
        console.log("Fetched asset models:", result.data);
        setAssetModels(result.data);
        setFilteredAssetModels(result.data);
        setIsLoading(false);
      } else {
        setError(result.error || "Failed to fetch asset models");
        setIsLoading(false);
      }
    };
    fetchAssetModels();
    fetchManufacturers();
    fetchAssetTypes();
  }, []);

  // When manufacturer changes, populate assetModels from selected manufacturer
  // useEffect(() => {
  //   if (!formData.manufacturer) {
  //     setAssetModels([]);
  //     setFilteredAssetModels([]);
  //     return;
  //   }
  //   const selectedManu = manufacturers.find(
  //     (m) => m._id === formData.manufacturer
  //   );
  //   // adjust `models` if your manufacturer object uses a different key
  //   const models =
  //     selectedManu && Array.isArray(selectedManu.models)
  //       ? selectedManu.models
  //       : [];
  //   setAssetModels(models);
  //   // reset model/filter when manufacturer changes
  //   setFormData((prev) => ({ ...prev, model: "" }));
  //   setModelFilterValue("");
  //   setFilteredAssetModels(models);
  // }, [formData.manufacturer, manufacturers]);

  // click outside dropdown to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        modelInputRef.current &&
        !modelInputRef.current.contains(e.target)
      ) {
        setFilteredAssetModels([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSelectModel = (model) => {
    setFormData((prev) => ({ ...prev, model }));
    setModelFilterValue(model);
    setFilteredAssetModels([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

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
                  <option
                    key={type._id}
                    value={type._id}
                    className="bg-slate-900"
                  >
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Manufacturer
              </label>
              <select
                name="manufacturer"
                value={formData.manufacturer}
                type="text"
                placeholder="e.g. Dell"
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option>Select Manufacturer</option>
                {manufacturers.map((manu) => (
                  <option
                    key={manu._id}
                    value={manu._id}
                    className="bg-slate-900"
                  >
                    {manu.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            {/* <div className="relative" ref={dropdownRef}>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Model
              </label>
              <input
                type="text"
                name="model"
                placeholder="e.g. XPS 15"
                value={modelFilterValue || formData.model}
                onChange={handleChange}
                ref={modelInputRef}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                onFocus={() => {
                  // show suggestions when focused and there's a filter or existing models
                  if (modelFilterValue || assetModels.length) {
                    const filtered = assetModels.filter((m) =>
                      m
                        .toLowerCase()
                        .includes((modelFilterValue || "").toLowerCase())
                    );
                    setFilteredAssetModels(filtered);
                  }
                }}
              />
              {filteredAssetModels && filteredAssetModels.length > 0 && (
                <ul className="absolute z-20 left-0 right-0 mt-2 max-h-48 overflow-auto bg-slate-900/90 border border-slate-700 rounded-lg shadow-lg">
                  {filteredAssetModels.map((m) => (
                    <li
                      key={m._id}
                      onClick={() => onSelectModel(m)}
                      className="px-4 py-2 hover:bg-slate-800 cursor-pointer text-white"
                    >
                      {m.name}
                    </li>
                  ))}
                </ul>
              )}
            </div> */}

            <div className="">
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Model
              </label>
              <select
                name="model"
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="" className="bg-slate-900">
                  Select Model
                </option>

                {filteredAssetModels.length > 0 ? (
                  filteredAssetModels.map((model) => (
                    <option key={model._id} value={model._id}>
                      {model.name}
                    </option>
                  ))
                ) : (
                  <option value="">No Model Found</option>
                )}
              </select>
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
