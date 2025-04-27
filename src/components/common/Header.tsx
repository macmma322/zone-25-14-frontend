'use client';

import React from 'react';

const Header = () => {
  return (
    <header className="w-full p-4 bg-gray-100 dark:bg-neutral-900 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Zone 25-14</h1>
        {/* Future: Nav links, Cart, Profile button */}
      </div>
    </header>
  );
};

export default Header;
