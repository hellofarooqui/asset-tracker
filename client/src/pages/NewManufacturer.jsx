import { Loader2 } from "lucide-react";
import React from "react";
import { useAppContext } from "../context/AppContext";

const NewManufacturer = () => {
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    logoImage: null,
  });
  // Separate state for file (don't store File object in formData)
  const [logoImage, setLogoImage] = React.useState(null);
  const [preview, setPreview] = React.useState(null);

  const { addNewManufacturer } = useAppContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input separately
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only image files (JPEG, PNG, GIF, WebP) are allowed!');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB!');
        return;
      }

      setLogoImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    setLogoImage(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    // Validate form data
    if (!formData.name) {
      alert("Manufacturer name is required");
      return;
    }
    
    if (!logoImage) {
      alert("Logo image is required");
      return;
    }

    console.log("Submitting form data:", formData);
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("logoImage", logoImage); // Append the actual File object
    data.append("contactInfo[email]", formData.email);
    data.append("contactInfo[phone]", formData.phone);
    data.append("contactInfo[address]", formData.address);

    try {
      console.log("Sending data to API:", data);
      setSaving(true);
      const response = await addNewManufacturer(data);
      console.log("Manufacturer added successfully:", response);
      
      // Reset form after success
      handleCancel();
      alert("Manufacturer added successfully!");
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Error adding manufacturer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* settings Page */}
        <div className={`flex-1 flex flex-col border-r border-slate-800 `}>
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 p-6">
            <h1 className="text-2xl font-bold text-white">New Manufacturer</h1>
          </div>
          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-y-6">
            <h2 className="text-xl text-slate-400 font-semibold">
              Add New Manufacturer
            </h2>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Manufacturer Name */}
                <div className="col-span-2">
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    disabled={saving}
                    type="text"
                    placeholder="Manufacturer name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
                  />
                </div>

                {/* Manufacturer Logo */}
                <div className="col-span-2">
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Logo
                  </label>
                  <input
                    disabled={saving}
                    type="file"
                    accept="image/*"
                    name="logoImage"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Accepted formats: JPEG, PNG, GIF, WebP (Max 5MB)
                  </p>
                  
                  {/* Image Preview */}
                  {preview && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-400 mb-2">Preview:</p>
                      <img
                        src={preview}
                        alt="Logo preview"
                        className="w-32 h-32 object-contain border border-slate-600 rounded-lg bg-slate-900"
                      />
                    </div>
                  )}
                </div>

                <p className="col-span-2 mt-4 text-slate-500 text-lg font-semibold">
                  Contact info
                </p>

                {/* Manufacturer Email */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    disabled={saving}
                    type="email"
                    placeholder="Support email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
                  />
                </div>

                {/* Manufacturer Phone */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    disabled={saving}
                    type="tel"
                    placeholder="Contact number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
                  />
                </div>

                {/* Manufacturer Address */}
                <div className="col-span-2">
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Address
                  </label>
                  <textarea
                    disabled={saving}
                    placeholder="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="resize-none w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
                    rows="3"
                  />
                </div>

                {/* Action Buttons */}
                <div className="col-span-2 flex justify-end gap-4 mt-8 pt-6 border-t border-slate-700/50">
                  <button
                    disabled={saving}
                    onClick={handleCancel}
                    className="px-6 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={saving}
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Saving...</span>
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewManufacturer;