'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full p-4 bg-gray-200 dark:bg-neutral-800 text-center text-sm">
      <div className="max-w-7xl mx-auto">
        © {new Date().getFullYear()} Zone 25-14. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
