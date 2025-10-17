import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, assetsAPI, usersAPI } from "../services/api";

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
  const [assets, setAssets] = useState([]);
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
  const register = async (name, email,username,password) => {
    try {
      setError(null);
      const response = await authAPI.register({ name,email,username, password });
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
      setError(null);
      const response = await assetsAPI.getAll(filters);
      setAssets(response.data.assets);
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
      setError(null);
      const response = await assetsAPI.create(assetData);
      setAssets((prev) => [...prev, response.data.asset]);
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
      setAssets((prev) =>
        prev.map((asset) =>
          asset._id === assetId ? response.data.asset : asset
        )
      );
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
      setAssets((prev) => prev.filter((asset) => asset._id !== assetId));
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
    assets,
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
    updateAssetStatus,
    getAssetStats,
    getRecentActivity,
    fetchUsers,
    addMaintenanceRecord,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
