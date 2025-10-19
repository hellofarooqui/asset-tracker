import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";

import ManufacturerCard from "./ManufacturerCard";
import { useNavigate } from "react-router-dom";

const Manufacturers = () => {
  const navigate = useNavigate();

  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getAllManufacturers } = useAppContext();

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await getAllManufacturers();
        console.log("Fetched manufacturers:", response.data);
        setManufacturers(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch manufacturers");
      } finally {
        setLoading(false);
      }
    };

    fetchManufacturers();
  }, []);
  if (loading) {
    return <p className="text-slate-400">Loading manufacturers...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-4">Manufacturers</h2>
        <button onClick={()=>navigate('newManufacturer')} className="bg-slate-700/60 hover:cursor-pointer hover:bg-blue-600 hover:text-white text-slate-200/60 text-sm border border-slate-600/60 px-4 py-2 rounded-md font-semibold">
          Add +
        </button>
      </div>
      {manufacturers.length === 0 ? (
        <p className="text-slate-400">No manufacturers found.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4 ">
          {manufacturers.map((manufacturer) => (
            <ManufacturerCard
              key={manufacturer._id}
              manufacturer={manufacturer}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Manufacturers;
