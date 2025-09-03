// components/ErrorMessage.tsx
import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: "default" | "inline" | "toast";
}

export default function ErrorMessage({
  message,
  onRetry,
  className = "",
  variant = "default",
}: ErrorMessageProps) {
  if (variant === "inline") {
    return (
      <div className={`text-red-400 text-sm ${className}`}>
        <span>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-2 text-blue-400 hover:text-blue-300 underline"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (variant === "toast") {
    return (
      <div
        className={`fixed top-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 ${className}`}
      >
        <div className="flex items-center justify-between">
          <span>{message}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="ml-4 bg-red-700 hover:bg-red-800 px-2 py-1 rounded text-sm"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-red-900/20 border border-red-500/50 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-red-400 text-sm font-medium">{message}</p>
        </div>
        {onRetry && (
          <div className="ml-4">
            <button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
