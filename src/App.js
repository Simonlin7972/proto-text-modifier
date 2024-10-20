import React, { useState, useCallback } from 'react';
import './styles/globals.css';
import EditableCard from './components/EditableCard';
import '@fontsource/inter';
import '@fontsource/roboto-mono';
import '@fontsource/montserrat';

function App() {
  const [title, setTitle] = useState("");

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };

  const handleReset = useCallback(() => {
    setTitle("");
  }, []);

  return (
    <div className="App bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <EditableCard
          initialText={title}
          onTextChange={handleTitleChange}
          onReset={handleReset}
          className="text-3xl font-bold text-black mb-6 text-center"
        />
      </div>
    </div>
  );
}

export default App;
