import { createContext, useContext, useState, useEffect } from "react";
import {
  authAPI,
  assetsAPI,
  usersAPI,
  manufacturersAPI,
} from "../services/api";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("assettrack_token");
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth initialization failed:", error);
          localStorage.removeItem("assettrack_token");
          localStorage.removeItem("assettrack_user");
        }
        finally{
          setLoading(false)
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ username, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("assettrack_token", token);
      localStorage.setItem("assettrack_user", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (name, email, username, password) => {
    try {
      setError(null);
      const response = await authAPI.register({
        name,
        email,
        username,
        password,
      });
      const { token, user: userData } = response.data;

      localStorage.setItem("assettrack_token", token);
      localStorage.setItem("assettrack_user", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("assettrack_token");
      localStorage.removeItem("assettrack_user");
    }
  };

  // Fetch all assets
  const fetchAssets = async (filters = {}) => {
    try {
      console.log("Fetching assets with filters:", filters);
      setError(null);
      const response = await assetsAPI.getAll(filters);
      
      return { success: true, data: response.data.assets };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch assets";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Add new asset
  const addAsset = async (assetData) => {
    try {
      console.log("Adding asset with data:", assetData);
      setError(null);
      const response = await assetsAPI.create(assetData);
  
      return { success: true, data: response.data.asset };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add asset";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update asset
  const updateAsset = async (assetId, updatedData) => {
    try {
      setError(null);
      const response = await assetsAPI.update(assetId, updatedData);

      return { success: true, data: response.data.asset };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update asset";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete asset
  const deleteAsset = async (assetId) => {
    try {
      setError(null);
      await assetsAPI.delete(assetId);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete asset";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Get asset by ID
  const getAssetById = async (assetId) => {
    try {
      setError(null);
      const response = await assetsAPI.getById(assetId);
      return { success: true, data: response.data.asset };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch asset";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getAssetTypes = async () => {
    try {
      setError(null);
      const response = await assetsAPI.getAssetTypes();
      return { success: true, data: response.data.types };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch asset types";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getAllManufacturers = async () => {
    try {
      setError(null);
      const response = await manufacturersAPI.getAllManufacturers();
      return { success: true, data: response.data.manufacturers };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch manufacturers";
      setError(errorMessage);
      console.error(error);
      return { success: false, error: errorMessage };
    }
  };

  const addNewManufacturer = async (manufacturerData) => {
    try {
      console.log("Adding manufacturer with data:", manufacturerData);
      console.log("Logo file", manufacturerData.get("logoImage"));
      setError(null);
      const response = await manufacturersAPI.addNewManufacturer(manufacturerData);
      return { success: true, data: response.data.manufacturer };
    } catch (error) {
      console.log("Error adding manufacturer:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add manufacturer";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateManufacturer = async (manufacturerId, updatedData) => {
    try {
      setError(null);
      const response = await assetsAPI.updateManufacturer(
        manufacturerId,
        updatedData
      );
      return { success: true, data: response.data.manufacturer };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update manufacturer";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteManufacturer = async (manufacturerId) => {
    try {
      setError(null);
      await assetsAPI.deleteManufacturer(manufacturerId);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete manufacturer";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getAssetModels = async () => {
    try {
      setError(null);
      const response = await assetsAPI.getAllAssetModels();
      return { success: true, data: response.data.models };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch asset models";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const addAssetModel = async (modelData) => {
    try {
      setError(null);
      const response = await assetsAPI.addAssetModel(modelData);
      return { success: true, data: response.data.model };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add asset model";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateAssetModel = async (modelId, updatedData) => {
    try {
      setError(null);
      const response = await assetsAPI.updateAssetModel(modelId, updatedData);
      return { success: true, data: response.data.model };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update asset model";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteAssetModel = async (modelId) => {
    try {
      setError(null);
      await assetsAPI.deleteAssetModel(modelId);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete asset model";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update asset status
  const updateAssetStatus = async (assetId, status) => {
    try {
      setError(null);
      const response = await assetsAPI.updateStatus(assetId, status);
      setAssets((prev) =>
        prev.map((asset) =>
          asset._id === assetId ? response.data.asset : asset
        )
      );
      return { success: true, data: response.data.asset };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update status";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Get asset statistics
  const getAssetStats = async () => {
    try {
      setError(null);
      const response = await assetsAPI.getStats();
      return { success: true, data: response.data.stats };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch stats";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Get recent activity
  const getRecentActivity = async (limit = 5) => {
    try {
      setError(null);
      const response = await assetsAPI.getRecentActivity(limit);
      return { success: true, data: response.data.activities };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch activity";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Fetch all users
  const fetchUsers = async (filters = {}) => {
    try {
      setError(null);
      const response = await usersAPI.getAll(filters);
      setUsers(response.data.users);
      return { success: true, data: response.data.users };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch users";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Add maintenance record
  const addMaintenanceRecord = async (assetId, record) => {
    try {
      setError(null);
      const response = await assetsAPI.addMaintenanceRecord(assetId, record);
      return { success: true, data: response.data.asset };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add maintenance record";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    users,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    fetchAssets,
    addAsset,
    updateAsset,
    deleteAsset,
    getAssetTypes,
    getAssetById,
    getAssetModels,
    addAssetModel,
    updateAssetModel,
    deleteAssetModel,
    updateAssetStatus,
    getAllManufacturers,
    addNewManufacturer,
    updateManufacturer,
    deleteManufacturer,
    getAssetStats,
    getRecentActivity,
    fetchUsers,
    addMaintenanceRecord,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
