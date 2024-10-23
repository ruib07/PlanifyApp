import React, { useState, useEffect } from "react";
import "../styles/ScrollToTop.css";

const ScrollToTop: React.FC = () => {
  const [windowScrolled, setWindowScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setWindowScrolled(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`scroll-to-top ${windowScrolled ? "show-scrollTop" : ""}`}>
      <button
        onClick={scrollToTop}
        className="scroll-btn"
        aria-label="Scroll to top"
      >
        <span style={{ fontSize: "24px" }}>↑</span>
      </button>
    </div>
  );
};

export default ScrollToTop;
