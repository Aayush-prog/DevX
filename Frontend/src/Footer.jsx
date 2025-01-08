import React from "react";
import logo from "../src/assets/devx.png";
export default function Footer() {
  return (
    <footer className="bg-primary text-white  py-8 mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:flex sm:justify-evenly">
        <div className="lg:w-1/3">
          <div className="flex items-center space-x-1  ">
            <span className="font-bold text-xl">DevX</span>
          </div>
          <p className="text-sm ">
            123 Main Street, Suite 456
            <br />
            Cityville, ST 78910
          </p>
          <p className="text-sm mt-2">
            <strong>Phone:</strong> (123) 456-7890
            <br />
            <strong>Email:</strong> contact@company.com
          </p>
        </div>

        <div className="hidden lg:block mt-6 sm:mt-0 ">
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition">
                Contact
              </a>
            </li>
          </ul>
          <p className="text-sm text-gray-400 mt-4">
            © 2025 DevX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
