import React from 'react';
import ThemeToggle from './ThemeToggle';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <ThemeToggle />
      {children}
    </div>
  );
};
