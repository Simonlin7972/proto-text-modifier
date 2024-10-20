import React, { useState, useCallback, useEffect, useRef } from 'react';
import '@fontsource/inter';
import '@fontsource/roboto-mono';
import '@fontsource/montserrat';
import quotes from '../quotes.json';
import { RotateCcw } from 'lucide-react';  // 導入 RotateCcw 圖標
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
  const [charCount, setCharCount] = useState(0);
  const [textBlocks, setTextBlocks] = useState<string[]>([]);
  const [copiedStates, setCopiedStates] = useState<boolean[]>([]);
  const [showBlocks, setShowBlocks] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    // 更新字符統計
    setCharCount(text.length);
  }, [text]);

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
    setTextBlocks([]); // 清除文本塊
    setCopiedStates([]); // 清除複製狀態
    setShowBlocks(false); // 隱藏右側區塊
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

  const handleSplitText = useCallback(() => {
    const blocks = [];
    for (let i = 0; i < text.length; i += 300) {
      blocks.push(text.slice(i, i + 300));
    }
    setTextBlocks(blocks);
    setCopiedStates(new Array(blocks.length).fill(false));
    setShowBlocks(true);  // 當分割文本時，顯示右側區塊
  }, [text]);

  const handleCopy = useCallback((index: number) => {
    navigator.clipboard.writeText(textBlocks[index]).then(() => {
      setCopiedStates(prev => {
        const newStates = [...prev];
        newStates[index] = true;
        return newStates;
      });
      setTimeout(() => {
        setCopiedStates(prev => {
          const newStates = [...prev];
          newStates[index] = false;
          return newStates;
        });
      }, 2000);
    });
  }, [textBlocks]);

  const handleEdit = useCallback((index: number) => {
    setEditingIndex(index);
  }, []);

  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const newBlocks = [...textBlocks];
    newBlocks[index] = e.target.value;
    setTextBlocks(newBlocks);
  }, [textBlocks]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (editRef.current && !editRef.current.contains(e.target as Node)) {
      setEditingIndex(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="flex align-items-center justify-center">
      <div className={`${className} w-1/2 bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out ${showBlocks ? 'mr-8' : ''}`}>
        <div className="pt-8 pr-8 pl-8 relative">
          <textarea
            value={text}
            onChange={handleTextChange}
            className="w-full h-48 p-4 border border-gray-300 hover:border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 overflow-auto resize-vertical"
            style={{ 
              fontSize: `${fontSize}px`, 
              fontWeight: fontWeight,
              letterSpacing: `${letterSpacing}px`,
              lineHeight: lineHeight,
              fontFamily: fontFamily,
              minHeight: '12rem', // 設置最小高度
              maxHeight: '32rem', // 設置最大高度
            }}
            placeholder="Please enter your text here.."
          />
          <div className="absolute bottom-4 right-12 text-sm text-gray-500">
            Character count: {charCount}
          </div>
        </div>
        <div className="px-8 py-4 space-y-4">
          <div className="space-y-2 pb-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <div className="space-y-2">
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
                  background: `linear-gradient(to right, #60a5fa ${((letterSpacing + 2.5) / (50 + 2)) * 100}%, #e5e7eb ${((letterSpacing + 2.5) / (50 + 2)) * 100}%)`
                }}
              />
            </div>
            <div className="space-y-2">
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
          </div>
          <div className="flex space-x-4 pb-4 pt-4">
            <div className="relative group">
              <button
                onClick={handleReset}
                className="flex-shrink-0 px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg font-semibold rounded-xl focus:outline-none focus:shadow-outline flex items-center justify-center"
                aria-label="Reset"
              >
                <RotateCcw size={24} />
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Reset
              </div>
            </div>
            <button
              onClick={handleSplitText}
              disabled={text.trim().length === 0}
              className={`flex-1 py-4 text-white text-lg font-semibold rounded-xl focus:outline-none focus:shadow-outline ${
                text.trim().length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
              }`}
            >
              Split Text
            </button>
            <button
              onClick={generateQuote}
              className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-xl focus:outline-none focus:shadow-outline"
            >
              Add Quote
            </button>
          </div>
        </div>
      </div>

{/* 右邊block區 */}
      <div className={`w-1/2 transition-all duration-300 ease-in-out ${showBlocks ? 'block' : 'hidden'}`}>
        {textBlocks.length > 0 && (
          <div className="space-y-6">
            {textBlocks.map((block, index) => (
              <div 
                key={index} 
                className="relative p-6 bg-gray-50 shadow-lg rounded-xl group"
              >
                {editingIndex === index ? (
                  <textarea
                    ref={editRef}
                    value={block}
                    onChange={(e) => handleEditChange(e, index)}
                    className="w-full h-32 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <p className="text-sm text-gray-700">{block}</p>
                )}
                {editingIndex !== index && (
                  <div className="absolute bottom-3 right-3 hidden group-hover:flex space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1 px-2 rounded-md transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCopy(index)}
                      className="bg-black hover:bg-gray-800 text-white text-sm font-semibold py-1 px-2 rounded-md transition-colors duration-200"
                    >
                      {copiedStates[index] ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableCard;
