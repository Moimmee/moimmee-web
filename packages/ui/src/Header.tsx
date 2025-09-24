"use client";

interface Props {
  top: number;
}

const Header = ({ top }: Props) => {
  return (
    <div className="w-full fixed z-99999 top-0 p-2 bg-white/80 backdrop-blur-sm border-b border-gray-300">
      <div style={{ height: top }} />
      <p className="text-2xl font-extrabold text-primary">모이미</p>
    </div>
  );
};

export default Header;
