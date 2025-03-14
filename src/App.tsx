import React, { useState } from 'react';
import { Palette, Copy, Check, Plus, Trash2, PaintBucket, Layers } from 'lucide-react';

interface Color {
  name: string;
  hex: string;
}

function App() {
  const [colors, setColors] = useState<Color[]>([
    { name: 'Color 1', hex: '#5465ff' },
    { name: 'Color 2', hex: '#788bff' },
    { name: 'Color 3', hex: '#9bb1ff' },
    { name: 'Color 4', hex: '#bfd7ff' },
    { name: 'Color 5', hex: '#e2fdff' },
  ]);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [output, setOutput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'input' | 'test'>('input');

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const hexToHsl = (hex: string): { h: number; s: number; l: number } | null => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;

    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const generateStyles = () => {
    let css = '';

    // CSS HEX
    css += '/* CSS HEX */\n';
    colors.forEach(color => {
      css += `--${color.name.toLowerCase().replace(/\s+/g, '-')}: ${color.hex}ff;\n`;
    });
    css += '\n';

    // CSS HSL
    css += '/* CSS HSL */\n';
    colors.forEach(color => {
      const hsl = hexToHsl(color.hex);
      if (hsl) {
        css += `--${color.name.toLowerCase().replace(/\s+/g, '-')}: hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1);\n`;
      }
    });
    css += '\n';

    // SCSS HEX
    css += '/* SCSS HEX */\n';
    colors.forEach(color => {
      css += `$${color.name.toLowerCase().replace(/\s+/g, '-')}: ${color.hex}ff;\n`;
    });
    css += '\n';

    // SCSS HSL
    css += '/* SCSS HSL */\n';
    colors.forEach(color => {
      const hsl = hexToHsl(color.hex);
      if (hsl) {
        css += `$${color.name.toLowerCase().replace(/\s+/g, '-')}: hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1);\n`;
      }
    });
    css += '\n';

    // SCSS RGB
    css += '/* SCSS RGB */\n';
    colors.forEach(color => {
      const rgb = hexToRgb(color.hex);
      if (rgb) {
        css += `$${color.name.toLowerCase().replace(/\s+/g, '-')}: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1);\n`;
      }
    });
    css += '\n';

    // Gradients
    css += '/* SCSS Gradient */\n';
    const colorList = colors.map(c => `${c.hex}ff`).join(', ');
    
    const gradients = [
      { name: 'gradient-top', angle: '0deg' },
      { name: 'gradient-right', angle: '90deg' },
      { name: 'gradient-bottom', angle: '180deg' },
      { name: 'gradient-left', angle: '270deg' },
      { name: 'gradient-top-right', angle: '45deg' },
      { name: 'gradient-bottom-right', angle: '135deg' },
      { name: 'gradient-top-left', angle: '225deg' },
      { name: 'gradient-bottom-left', angle: '315deg' }
    ];

    gradients.forEach(gradient => {
      css += `$${gradient.name}: linear-gradient(${gradient.angle}, ${colorList});\n`;
    });
    css += `$gradient-radial: radial-gradient(${colorList});\n`;

    setOutput(css);
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const handleColorChange = (index: number, field: keyof Color, value: string) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  const addNewColor = () => {
    setColors([...colors, { name: `Color ${colors.length + 1}`, hex: '#000000' }]);
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center gap-3">
          <Palette className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Coolors Palette CSS Style Generator</h1>
        </header>

        <div className="flex gap-4 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'input'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('input')}
          >
            <div className="flex items-center gap-2">
              <PaintBucket className="w-4 h-4" />
              <span>Input Colors</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'test'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('test')}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Test UI</span>
            </div>
          </button>
        </div>

        {activeTab === 'input' ? (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Input Colors</h2>
                <button
                  onClick={addNewColor}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Color</span>
                </button>
              </div>
              <div className="space-y-4">
                {colors.map((color, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-lg" style={{ backgroundColor: color.hex }} />
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Color name"
                      />
                      <input
                        type="text"
                        value={color.hex}
                        onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md font-mono"
                        placeholder="Hex color (#000000)"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                        className="h-10 w-10"
                      />
                      {colors.length > 1 && (
                        <button
                          onClick={() => removeColor(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={generateStyles}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Generate CSS
              </button>
            </div>

            {output && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Generated CSS</h2>
                  <button
                    onClick={() => copyToClipboard(output)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    {copiedValue === output ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>{output}</code>
                </pre>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-8">
            {/* Color Swatches */}
            <section className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Color Swatches</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {colors.map((color, index) => (
                  <div key={index} className="space-y-2">
                    <div
                      className="h-24 rounded-lg shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="text-sm font-medium text-center">{color.name}</p>
                    <p className="text-xs text-gray-500 text-center font-mono">{color.hex}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Gradient Examples */}
            <section className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Gradient Examples</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Top to Bottom', style: `linear-gradient(180deg, ${colors.map(c => c.hex).join(', ')})` },
                  { name: 'Left to Right', style: `linear-gradient(90deg, ${colors.map(c => c.hex).join(', ')})` },
                  { name: 'Diagonal', style: `linear-gradient(45deg, ${colors.map(c => c.hex).join(', ')})` },
                  { name: 'Radial', style: `radial-gradient(circle, ${colors.map(c => c.hex).join(', ')})` },
                ].map((gradient, index) => (
                  <div key={index} className="h-32 rounded-lg overflow-hidden shadow-lg">
                    <div
                      className="w-full h-full"
                      style={{ background: gradient.style }}
                    >
                      <div className="w-full h-full bg-black bg-opacity-20 p-4">
                        <p className="text-white font-medium">{gradient.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Text Contrast Examples */}
            <section className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Text Contrast Examples</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg"
                    style={{ backgroundColor: color.hex }}
                  >
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#ffffff' }}>
                      {color.name} - Light Text
                    </h3>
                    <p className="mb-4" style={{ color: '#ffffff' }}>
                      The quick brown fox jumps over the lazy dog.
                    </p>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>
                      {color.name} - Dark Text
                    </h3>
                    <p style={{ color: '#000000' }}>
                      The quick brown fox jumps over the lazy dog.
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;