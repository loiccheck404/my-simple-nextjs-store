import React from "react";

// Footer component
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-10 rounded-t-lg shadow-inner">
      <div className="container mx-auto text-center">
        {/* Copyright information */}
        <p>
          &copy; {new Date().getFullYear()} Your Company Name. All rights
          reserved.
        </p>
        {/* Navigation links or policy links */}
        <div className="flex justify-center space-x-4 mt-3">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
