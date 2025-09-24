"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import Tabbar from "./Tabbar";

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  const [pathname, setPathname] = useState("");
  const [isRouting, setIsRouting] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.href);

      const handleLocationChange = () => {
        setPathname(window.location.href);
      };

      window.addEventListener("popstate", handleLocationChange);

      return () => {
        window.removeEventListener("popstate", handleLocationChange);
      };
    }
  }, []);

  const handleNavigation = (url: string) => {
    setIsRouting(true);

    setTimeout(() => {
      if (typeof window !== "undefined") {
        if (window.location.href !== url) {
          window.location.href = url;
        } else {
          setIsRouting(false);
        }
      }
    }, 50);
  };

  useEffect(() => {
    if (isRouting) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [isRouting]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRouting(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <Header />
      {children}
      <Tabbar handleNavigation={handleNavigation} />
      {isRouting && (
        <div className="w-screen h-screen bg-black/40 fixed top-0 z-999999 flex items-center justify-center">
          <div className="relative w-16 h-16 rounded-full border-2 border-[#FF6969]/20 overflow-hidden bg-white shadow-lg">
            <div 
              className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#FF6969] to-[#FF6969]/80 rounded-b-full"
              style={{
                animation: 'waterFill 2.5s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalLayout;
