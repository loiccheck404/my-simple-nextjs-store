import { useState, useEffect } from "react";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Hide offline message after 5 seconds when back online
    if (isOnline && showOfflineMessage) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline, showOfflineMessage]);

  if (!showOfflineMessage && isOnline) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 ${
        isOnline ? "bg-green-600" : "bg-red-600"
      } text-white px-4 py-2 text-center text-sm`}
    >
      {isOnline ? (
        <span>✅ Connection restored</span>
      ) : (
        <span>⚠️ You're offline. Some features may not work properly.</span>
      )}
    </div>
  );
}
