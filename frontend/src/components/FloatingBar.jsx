// components/FloatingBar.jsx
import { useState } from 'react';
import { MousePointer2, Pen, Eraser, Palette } from 'lucide-react';
export default function FloatingBar({ onToolChange, onColorChange }) {
    const [activeTool, setActiveTool] = useState('cursor');

    const tools = [
        { id: 'cursor', icon: <MousePointer2 size={20} /> },
        { id: 'pen', icon: <Pen size={20} /> },
        { id: 'eraser', icon: <Eraser size={18} /> },
    ];
    return (
        <div className="floating-bar">
            {tools.map(tool => (
                <button
                    key={tool.id}
                    onClick={() => { setActiveTool(tool.id); onToolChange(tool.id); }}
                    className={`bar-tool ${activeTool === tool.id ? 'active' : ''}`}
                    title={tool.id}
                >
                    {tool.icon}
                </button>
            ))}

            <div className="divider-v" />

            {/* Simple Color Picker */}
            <div className="flex items-center" style={{ gap: '8px' }}>
                {['#ef4444', '#22c55e', '#3b82f6', '#eab308'].map(color => (
                    <button
                        key={color}
                        onClick={() => onColorChange(color)}
                        className="color-dot"
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>
        </div>
    );
}