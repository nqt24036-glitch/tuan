import React from 'react';

const MiniMap: React.FC = () => {
  return (
    <div className="absolute top-4 right-4 w-44 h-44 bg-black/60 border-2 border-yellow-700/80 rounded-full p-2 backdrop-blur-sm z-20 hidden lg:flex flex-col items-center justify-center shadow-lg shadow-black/50">
      <div className="w-full h-full border border-yellow-800 rounded-full relative">
        {/* Compass */}
        <div className="absolute inset-0 flex items-center justify-center text-yellow-800/50 font-serif text-xs">
            <div className="absolute top-0">N</div>
            <div className="absolute bottom-0">S</div>
            <div className="absolute left-1">W</div>
            <div className="absolute right-1">E</div>
        </div>
        
        {/* Player Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 border border-cyan-200" title="Bạn"></div>
        
        {/* Point of Interest 1: Clan */}
        <div className="absolute top-[20%] right-[30%] w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse" title="Thanh Vân Tông"></div>
        
        {/* Point of Interest 2: Quest Area */}
        <div className="absolute top-1/4 left-1/4 w-2.5 h-2.5 bg-green-500 rounded-full" title="Thảo Dược Cốc"></div>

        {/* Point of Interest 3: Dungeon/Boss */}
        <div className="absolute bottom-[30%] right-[25%] w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" title="Ma Thú Sơn Mạch"></div>
      </div>
      <p className="text-center text-sm text-yellow-300 font-serif mt-2 absolute bottom-2 bg-black/60 px-2 py-0.5 rounded-md">Vô Danh Cốc</p>
    </div>
  );
};

export default MiniMap;
