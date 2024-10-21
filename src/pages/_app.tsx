import React from 'react';
import '../styles/globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import ThemeToggle from '../components/ThemeToggle';
import EditableCard from '../components/EditableCard';

function App() {
  return (
    <ThemeProvider>
      <div className="App bg-gray-200 dark:bg-gray-800 min-h-screen flex items-center justify-center transition-colors duration-200">
        <ThemeToggle />
        <EditableCard />
      </div>
    </ThemeProvider>
  );
}

export default App;
