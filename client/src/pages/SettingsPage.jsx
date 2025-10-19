import React from "react";
import Categories from "../components/settingsPage/Categories";
import Manufacturers from "../components/settingsPage/Manufacturers";
import AssetModels from "../components/settingsPage/AssetModels";
import Users from "../components/settingsPage/Users";

const SettingsPage = () => {
  return (
    <div className="flex h-screen bg-slate-900">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* settings Page */}
        <div className={`flex-1 flex flex-col border-r border-slate-800 `}>
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 p-6">
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>
          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-y-6">
            {/* Manufactureres */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8 text-white">
              <Manufacturers/>
              {/* Add settings form or options here */}
            </div>

            {/* Asset Categories */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8 text-white">
              <Categories/>
              {/* Add settings form or options here */}
            </div>

            {/* Asset Models */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8 text-white">
             <AssetModels/>
              {/* Add settings form or options here */}
            </div>

             {/* Users */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8 text-white">
             <Users/>
              {/* Add settings form or options here */}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
