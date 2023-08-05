import React, { useEffect } from 'react';

const KommunicateChat = () => {
  useEffect(() => {
    const kommunicateSettings = {
      appId: '1a0f260915cf48815a2fffa7815edd395',
      popupWidget: true,
      automaticChatOpenOnNavigation: true,
    };

    // Check if Kommunicate is already loaded
    if (!window.kommunicate) {
      (function (d, m) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://widget.kommunicate.io/v2/kommunicate.app';
        var h = document.getElementsByTagName('head')[0];
        h.appendChild(s);
        window.kommunicate = m;
        m._globals = kommunicateSettings;
      })(document, window.kommunicate || {});
    } else {
      window.kommunicate._globals = kommunicateSettings;
    }
  }, []);

  return null; // Return null since this component doesn't render anything
};

export default KommunicateChat;
