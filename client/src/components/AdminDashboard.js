import React, { useEffect, useState } from "react";
import Iframe from "react-iframe";
import { useNavigate } from "react-router-dom";
const AdminDashboard= () => {
  const [iframeWidth, setIframeWidth] = useState(window.innerWidth);
  const [iframeHeight, setIframeHeight] = useState(window.innerHeight);


return (
  <div>
    <Iframe
      url="https://us-east-1.quicksight.aws.amazon.com/sn/embed/share/accounts/602106029022/dashboards/0f09335b-a8ae-400b-a2b3-77ded9c53e60?directory_alias=parthchampaneria"
      width={iframeWidth}
      height={iframeHeight}
      allowFullScreen
    />
  </div>
);
};

export default AdminDashboard;