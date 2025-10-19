import React, { useState } from 'react'
import { EllipsisVertical, Menu, Pencil, Trash } from "lucide-react";

const server = import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:5000";

const ManufacturerCard = ({manufacturer}) => {
      const [showMenu, setShowMenu] = useState(false);
  return (
   <div
              key={manufacturer._id}
              className="p-4 bg-slate-800 rounded-lg flex flex-col relative "
            >
              <div className='flex items-center gap-x-4'>
                {manufacturer.logoImage ? (
                  <img src={`${server}${manufacturer.logoImage}`} className='w-12 h-12 border object-contain p-1 border-slate-500 rounded-md'/>
                ) : (
                  <span className="w-12 h-12 bg-slate-500/60 rounded-md"></span>
                )}
                <span className="text-slate-200 text-xl">{manufacturer.name}</span>
              </div>
              <button onClick={()=>setShowMenu(prev=>!prev)} className="absolute top-[50%] right-2 -translate-y-[50%] text-slate-600 hover:text-slate-300 cursor-pointer "><EllipsisVertical size={16}/></button>

              {showMenu && (
                <div className="flex flex-col bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 mt-2 absolute top-2 right-6 overflow-hidden">
                   <button className="hover:bg-slate-600/60 hover:cursor-pointer flex gap-x-4 justify-between text-sm text-slate-200/60 py-2 px-4 border-b border-slate-600/60">
                    Edit <Pencil size={16}/>
                  </button>
                  <button className=" hover:bg-slate-600/60 hover:cursor-pointer flex gap-x-4 text-sm text-red-500 py-2 px-4">
                    Delete <Trash size={16}/>
                  </button>
                </div>
              )}
            </div>
  )
}

export default ManufacturerCard