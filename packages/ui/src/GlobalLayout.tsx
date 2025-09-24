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
  const [safeAreaTop, setSafeAreaTop] = useState(40);
  const [safeAreaBottom, setSafeAreaBottom] = useState(20);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;
      
      const topParam = searchParams.get('top');
      const bottomParam = searchParams.get('bottom');
      
      if (topParam) {
        const topValue = parseInt(topParam, 10);
        if (!isNaN(topValue) && topValue >= 0) {
          setSafeAreaTop(topValue);
        }
      }
      
      if (bottomParam) {
        const bottomValue = parseInt(bottomParam, 10);
        if (!isNaN(bottomValue) && bottomValue >= 0) {
          setSafeAreaBottom(bottomValue);
        }
      }
    }
  }, [pathname]);

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
    const timer = setTimeout(() => {
      setIsRouting(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <Header top={safeAreaTop} />
      {children}
      <Tabbar bottom={safeAreaBottom} handleNavigation={handleNavigation} />
      {isRouting && (
        <div className="w-screen h-screen bg-black/40 fixed top-0 z-999999 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-3 border-primary border-t-gray-300 overflow-hidden shadow-lg animate-spin">
          
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalLayout;
