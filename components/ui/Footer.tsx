import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-6 text-center text-slate-400 text-xs font-medium uppercase tracking-wider">
      <p>&copy; {new Date().getFullYear()} Tevas Technologies. MMIS Platform v2.0</p>
    </footer>
  );
};