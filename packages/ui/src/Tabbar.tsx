"use client";

import { Home, Plus, User } from "lucide-react";

interface Props {
  handleNavigation: (herf: string) => void;
  bottom: number;
}

const Tabbar = ({ handleNavigation, bottom }: Props) => {
  return (
    <div className="w-full fixed z-9999 bottom-0 bg-white border-t border-gray-300">
      <div className="w-full h-full flex items-center justify-around py-3 relative">
        <Home size={28} onClick={() => handleNavigation("http://10.80.161.203:3000")} />
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white absolute bottom-4">
          <Plus />
        </div>
        <User size={28} onClick={() => handleNavigation("http://10.80.161.203:3001")} />
      </div>
      <div style={{ height: bottom }} />
    </div>
  );
};

export default Tabbar;
