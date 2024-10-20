import React, { useState, useCallback, useEffect } from 'react';
import '@fontsource/inter';
import '@fontsource/roboto-mono';
import '@fontsource/montserrat';
import quotes from '../quotes.json';
// import './styles/globals.css';


interface EditableCardProps {
  initialText?: string;
  onTextChange?: (text: string) => void;
  onReset?: () => void;
  className?: string;
}

type FontFamily = 'Inter' | 'Roboto Mono' | 'Montserrat';

const EditableCard: React.FC<EditableCardProps> = ({ initialText = '', onTextChange, onReset, className = '' }) => {
  const [text, setText] = useState(initialText);
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState(400);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [fontFamily, setFontFamily] = useState<FontFamily>('Inter');

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (onTextChange) {
      onTextChange(newText);
    }
  }, [onTextChange]);

  const handleFontSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(Number(e.target.value));
  }, []);

  const handleFontWeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFontWeight(Number(e.target.value));
  }, []);

  const handleLetterSpacingChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLetterSpacing(Number(e.target.value));
  }, []);

  const handleLineHeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLineHeight(Number(e.target.value));
  }, []);

  const handleFontFamilyChange = useCallback((font: FontFamily) => {
    setFontFamily(font);
  }, []);

  const handleReset = useCallback(() => {
    setText('');
    setFontSize(24);
    setFontWeight(400);
    setLetterSpacing(0);
    setLineHeight(1.5);
    setFontFamily('Inter');
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  const generateQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * quotes.quotes.length);
    const randomQuote = quotes.quotes[randomIndex];
    const quoteText = `「${randomQuote.text}」 - ${randomQuote.author}`;
    setText(quoteText);
    if (onTextChange) {
      onTextChange(quoteText);
    }
  }, [onTextChange]);

  return (
    <div className={`${className} max-w-lg mx-auto bg-white shadow-xl rounded-2xl overflow-hidden`}>
      <div className="pt-8 pr-8 pl-8">
        <textarea
          value={text}
          onChange={handleTextChange}
          className="w-full h-40 p-4 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ 
            fontSize: `${fontSize}px`, 
            fontWeight: fontWeight,
            letterSpacing: `${letterSpacing}px`,
            lineHeight: lineHeight,
            fontFamily: fontFamily,
            overflow: text.split('\n').length > 2 ? 'hidden' : 'auto',
            whiteSpace: text.split('\n').length > 2 ? 'nowrap' : 'normal',
            textOverflow: text.split('\n').length > 2 ? 'ellipsis' : 'clip',
          }}
          placeholder="Please enter your text here..."
        />
      </div>
      <div className="px-8 py-4 space-y-4">
        <div className="space-y-2">
          <div className="flex space-x-4">
            {['Inter', 'Roboto Mono', 'Montserrat'].map((font) => (
              <button
                key={font}
                onClick={() => handleFontFamilyChange(font as FontFamily)}
                className={`flex-1 py-3 px-3 text-sm font-semibold rounded-xl ${
                  fontFamily === font
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-0 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-700">Font Size</span>
            <span className="text-sm text-gray-600">{fontSize}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="48"
            value={fontSize}
            onChange={handleFontSizeChange}
            className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #60a5fa ${((fontSize - 12) / (48 - 12)) * 100}%, #e5e7eb ${((fontSize - 12) / (48 - 12)) * 100}%)`
            }}
          />
        </div>
        <div className="space-y-0">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-700">Font Weight</span>
            <span className="text-sm text-gray-600">{fontWeight}</span>
          </div>
          <input
            type="range"
            min="100"
            max="900"
            step="100"
            value={fontWeight}
            onChange={handleFontWeightChange}
            className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #60a5fa ${((fontWeight - 100) / (900 - 100)) * 100}%, #e5e7eb ${((fontWeight - 100) / (900 - 100)) * 100}%)`
            }}
          />
        </div>
        <div className="space-y-0">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-700">Letter Spacing</span>
            <span className="text-sm text-gray-600">{letterSpacing}px</span>
          </div>
          <input
            type="range"
            min="-2"
            max="50"
            step="0.5"
            value={letterSpacing}
            onChange={handleLetterSpacingChange}
            className="w-full h-4 bg-gray-200 rounded-xl appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #60a5fa ${((letterSpacing + 2.2) / (50 + 2)) * 100}%, #e5e7eb ${((letterSpacing + 2) / (50 + 2)) * 100}%)`
            }}
          />
        </div>
        <div className="space-y-0 pb-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-700">Line Height</span>
            <span className="text-sm text-gray-600">{lineHeight.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={lineHeight}
            onChange={handleLineHeightChange}
            className="w-full h-4 bg-gray-200 rounded-xl appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #60a5fa ${((lineHeight - 1) / (3 - 1)) * 100}%, #e5e7eb ${((lineHeight - 1) / (3 - 1)) * 100}%)`
            }}
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleReset}
            className="flex-1 py-4 mr-3 bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg font-semibold rounded-xl focus:outline-none focus:shadow-outline"
          >
            Reset
          </button>
          <button
            onClick={generateQuote}
            className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-xl focus:outline-none focus:shadow-outline"
          >
            Add Quote
          </button>
        </div>
        <div className="mb-4"></div>
      </div>
    </div>
  );
};

export default EditableCard;
