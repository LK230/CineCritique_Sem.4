import React, { useEffect, useState } from "react";
import "./Alert.css";

export default function Alert({ message, type }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);

      // Hide the alert after 10 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 10000); // 10 seconds

      // Cleanup the timer if the component is unmounted or if message changes
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message]);

  if (!visible) return null;

  return <div className={`alert ${type}`}>{message}</div>;
}
