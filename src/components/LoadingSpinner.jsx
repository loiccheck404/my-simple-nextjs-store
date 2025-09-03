// components/LoadingSpinner.jsx
// components/LoadingSpinner.tsx
import React from "react";
import PropTypes from "prop-types";

export default function LoadingSpinner({
  size = "medium",
  color = "blue",
  className = "",
}) {
  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "w-4 h-4";
      case "medium":
        return "w-8 h-8";
      case "large":
        return "w-12 h-12";
      default:
        return "w-8 h-8";
    }
  };

  const getColorClass = () => {
    switch (color) {
      case "blue":
        return "border-blue-500";
      case "white":
        return "border-white";
      case "gray":
        return "border-gray-500";
      default:
        return "border-blue-500";
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${getSizeClass()} ${getColorClass()} border-2 border-t-2 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf(["blue", "white", "gray"]),
  className: PropTypes.string,
};
