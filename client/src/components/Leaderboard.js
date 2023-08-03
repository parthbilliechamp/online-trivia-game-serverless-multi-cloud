import React, { useEffect, useState } from "react";
import Iframe from "react-iframe";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const [iframeWidth, setIframeWidth] = useState(window.innerWidth);
  const [iframeHeight, setIframeHeight] = useState(window.innerHeight);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIframeWidth(window.innerWidth);
      setIframeHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleViewStatsClick = () => {
    navigate("/top-leader-stats");
  };

  return (
    <div>
      <Iframe
        url="https://us-east-1.quicksight.aws.amazon.com/sn/embed/share/accounts/602106029022/dashboards/d4476fc2-c700-4a09-8022-15219575d0d8?directory_alias=parthchampaneria"
        width={iframeWidth}
        height={iframeHeight}
        allowFullScreen
      />
      <button
        onClick={handleViewStatsClick}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#275394",
          color: "#fff",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          zIndex: "9999",
        }}
      >
        View Top Leader Stats
      </button>
    </div>
  );
};

export default Leaderboard;
