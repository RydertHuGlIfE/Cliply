import { useEffect, useRef, useState } from 'react';

export default function WebcamOverlay({ stream }) {
    const videoRef = useRef(null);
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const handlePointerDown = (e) => {
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;

        const newX = e.clientX - dragOffset.current.x;
        const newY = e.clientY - dragOffset.current.y;

        // Simple bounds checking could be added here if needed
        setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = (e) => {
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    if (!stream) return null;

    return (
        <div
            className="fixed z-[3000] cursor-move shadow-2xl rounded-xl overflow-hidden border-2 border-[#ccfa00] transition-transform active:scale-105"
            style={{
                left: position.x,
                top: position.y,
                width: '320px',
                aspectRatio: '16/9',
                touchAction: 'none'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover bg-black"
            />
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded font-mono pointer-events-none">
                CAM_01
            </div>
        </div>
    );
}
