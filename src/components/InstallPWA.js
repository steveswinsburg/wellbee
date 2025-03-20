import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted PWA installation");
      }
      setDeferredPrompt(null);
      setShowInstall(false);
    });
  };

  if (!showInstall) return null; 

  return (
    <Button
      variant="primary"
      onClick={handleInstall}
      style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}
    >
      Install App
    </Button>
  );
};

export default InstallPWA;