import { createContext, useState, useEffect } from "react";

export default function useScrollListener() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0
  });

  // set up event listeners
  useEffect(() => {
    let requestId;

    const handleScroll = () => {
      cancelAnimationFrame(requestId);
      requestId = requestAnimationFrame(() => {
        setData((last) => ({
          x: window.scrollX,
          y: window.scrollY,
          lastX: last.x,
          lastY: last.y
        }));
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      cancelAnimationFrame(requestId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return data;
}

export const ScrollContext = createContext(null);
