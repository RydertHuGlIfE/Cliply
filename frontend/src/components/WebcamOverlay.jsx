import { useEffect, useRef, useState } from 'react'

const SIZES = [
    { label: 'S', width: 160, height: 120 },
    { label: 'M', width: 220, height: 165 },
    { label: 'L', width: 300, height: 225 },
]

export default function WebcamOverlay({ visible }) {
    const videoRef = useRef(null)
    const streamRef = useRef(null)
    const overlayRef = useRef(null)
    const dragging = useRef(false)
    const dragStart = useRef({ mx: 0, my: 0, tx: 0, ty: 0 })

    const [sizeIdx, setSizeIdx] = useState(1)   // default M
    const [pos, setPos] = useState(null) // null = CSS default (bottom-right)
    const [error, setError] = useState(null)
    const [mirrored, setMirrored] = useState(true)

    // Start / stop webcam based on visibility
    useEffect(() => {
        if (!visible) {
            stopCam()
            return
        }
        startCam()
        return () => stopCam()
    }, [visible])

    const startCam = async () => {
        setError(null)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
        } catch (err) {
            console.warn('[Webcam] access denied:', err)
            setError('Camera access denied')
        }
    }

    const stopCam = () => {
        streamRef.current?.getTracks().forEach(t => t.stop())
        streamRef.current = null
        if (videoRef.current) videoRef.current.srcObject = null
    }

    // Drag logic — capture actual rect at drag start, move by delta
    const onPointerDown = (e) => {
        if (e.target.closest('.webcam-controls')) return
        const el = overlayRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        dragging.current = true
        dragStart.current = { mx: e.clientX, my: e.clientY, tx: rect.left, ty: rect.top }
        e.preventDefault()
    }

    useEffect(() => {
        const onMove = (e) => {
            if (!dragging.current) return
            const dx = e.clientX - dragStart.current.mx
            const dy = e.clientY - dragStart.current.my
            setPos({ x: dragStart.current.tx + dx, y: dragStart.current.ty + dy })
        }
        const onUp = () => { dragging.current = false }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
        }
    }, [])

    if (!visible) return null

    const { width, height } = SIZES[sizeIdx]
    const posStyle = pos
        ? { left: pos.x, top: pos.y, bottom: 'auto', right: 'auto' }
        : {}

    return (
        <div
            ref={overlayRef}
            className="webcam-overlay"
            style={{ width, height, ...posStyle }}
            onMouseDown={onPointerDown}
        >
            {error ? (
                <div className="webcam-error">
                    <span>📷</span>
                    <span>{error}</span>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    className="webcam-video"
                    autoPlay
                    muted
                    playsInline
                    style={{ transform: mirrored ? 'scaleX(-1)' : 'none' }}
                />
            )}

            {/* Controls bar */}
            <div className="webcam-controls">
                {/* Size picker */}
                {SIZES.map((s, i) => (
                    <button
                        key={s.label}
                        className={`webcam-ctrl-btn ${sizeIdx === i ? 'active' : ''}`}
                        title={`Size ${s.label}`}
                        onClick={() => setSizeIdx(i)}
                    >
                        {s.label}
                    </button>
                ))}

                {/* Mirror toggle */}
                <button
                    className={`webcam-ctrl-btn ${mirrored ? 'active' : ''}`}
                    title="Mirror"
                    onClick={() => setMirrored(v => !v)}
                >
                    ⇄
                </button>
            </div>

            {/* Drag hint */}
            <div className="webcam-drag-hint">⠿</div>
        </div>
    )
}
