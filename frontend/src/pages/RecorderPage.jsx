import { useState, useEffect, useRef, useCallback } from 'react'
import StepIndicator from '../components/StepIndicator'
import SetupPanel from '../components/SetupPanel'
import RecordingPanel from '../components/RecordingPanel'
import PreviewPanel from '../components/PreviewPanel'
import UploadPanel from '../components/UploadPanel'
import SharePanel from '../components/SharePanel'
import { startRecording, stopRecording, pauseRecording, resumeRecording } from '../modules/recorder'
import { uploadBlob } from '../modules/uploader'

// Zenith Components
import Navbar from '../components/zenith/Navbar'
import Hero from '../components/zenith/Hero'
import Services from '../components/zenith/Services'
import Work from '../components/zenith/Work'
import Testimonials from '../components/zenith/Testimonials'
import Contact from '../components/zenith/Contact'
import Footer from '../components/zenith/Footer'

// Annotation
import FloatingBar from '../components/FloatingBar'
import { CanvasCompositor } from '../modules/compositor'

const STEP_NUM = { setup: 1, recording: 2, preview: 2, uploading: 3, share: 3 }

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast')
    if (existing) existing.remove()
    const icons = { success: '✅', error: '❌', info: '💡' }
    const toast = document.createElement('div')
    toast.className = `toast toast-${type}`
    toast.innerHTML = `<span>${icons[type] || '💡'}</span><span>${message}</span>`
    document.body.appendChild(toast)
    setTimeout(() => {
        toast.style.opacity = '0'
        toast.style.transform = 'translateX(40px)'
        toast.style.transition = 'all 0.3s ease'
        setTimeout(() => toast.remove(), 300)
    }, 3500)
}

export default function RecorderPage() {
    const [phase, setPhase] = useState('setup')
    const [isPaused, setIsPaused] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const [blobUrl, setBlobUrl] = useState(null)
    const [blob, setBlob] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadLoaded, setUploadLoaded] = useState(0)
    const [uploadTotal, setUploadTotal] = useState(0)
    const [shareUrl, setShareUrl] = useState('')
    const [sharePassword, setSharePassword] = useState('')

    // SYS_SYNC State
    const [syncRate, setSyncRate] = useState(0);

    // Drawing State
    const [isDrawingToolsVisible, setIsDrawingToolsVisible] = useState(false)
    const [activeTool, setActiveTool] = useState('cursor')
    const [activeColor, setActiveColor] = useState('#ef4444')
    const compositorRef = useRef(null)

    const timerRef = useRef(null)

    const startTimer = () => {
        setElapsed(0)
        timerRef.current = setInterval(() => {
            setElapsed(e => e + 1)
        }, 1000)
    }

    const stopTimer = () => {
        clearInterval(timerRef.current)
        timerRef.current = null
    }

    useEffect(() => {
        const i = setInterval(() => {
            setSyncRate(prev => prev + 0.05);
        }, 10);
        return () => {
            clearInterval(i);
            stopTimer();
        }
    }, []);

    const handleStart = useCallback(async (opts = { useMic: true, useSystemAudio: true, useCamera: false }) => {
        const { useMic, useSystemAudio, useCamera } = opts;

        // Initialize Compositor
        const compositor = new CanvasCompositor(1920, 1080)
        compositorRef.current = compositor

        const result = await startRecording({
            useMic,
            useSystemAudio,
            useCamera,
            compositor: compositor,
            onChunk: () => { },
            onStop: (recordedBlob) => {
                const url = URL.createObjectURL(recordedBlob)
                setBlobUrl(url)
                setBlob(recordedBlob)
                stopTimer()
                setPhase('preview')
                setIsDrawingToolsVisible(false)
                compositor.stop()
            },
            onError: (err) => {
                stopTimer()
                setPhase('setup')
                setIsDrawingToolsVisible(false)
                compositor.stop()
                if (err.name === 'NotAllowedError') {
                    showToast('Screen capture permission denied', 'error')
                } else {
                    showToast(`Error: ${err.message}`, 'error')
                }
            },
        })
        if (result) {
            setPhase('recording')
            setIsPaused(false)
            setIsDrawingToolsVisible(true)
            startTimer()
            if (result.warning === 'system_audio_missing') {
                showToast('System audio missing. Tab sharing is recommended for audio.', 'error')
            }
        }
    }, [])

    const handleStop = useCallback(() => {
        stopRecording()
        stopTimer()
    }, [])

    const handlePause = useCallback(() => {
        if (isPaused) {
            resumeRecording()
            setIsPaused(false)
            timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
        } else {
            pauseRecording()
            setIsPaused(true)
            clearInterval(timerRef.current)
        }
    }, [isPaused])

    const handleCancel = useCallback(() => {
        stopRecording()
        stopTimer()
        setPhase('setup')
        setElapsed(0)
        setIsPaused(false)
        setIsDrawingToolsVisible(false)
    }, [])

    const handleUpload = useCallback(async () => {
        if (!blob) return
        setPhase('uploading')
        setUploadProgress(0)
        try {
            const result = await uploadBlob(blob, {
                onProgress: (pct, loaded, total) => {
                    setUploadProgress(pct)
                    setUploadLoaded(loaded)
                    setUploadTotal(total)
                },
            })
            setShareUrl(result.shareUrl)
            setSharePassword(result.password)
            setPhase('share')
            showToast('Recording uploaded successfully!', 'success')
        } catch (err) {
            showToast(`Upload failed: ${err.message}`, 'error')
            setPhase('preview')
        }
    }, [blob])

    const handleReRecord = useCallback(() => {
        if (blobUrl) URL.revokeObjectURL(blobUrl)
        setBlobUrl(null)
        setBlob(null)
        setPhase('setup')
    }, [blobUrl])

    const handleNewRecording = useCallback(() => {
        if (blobUrl) URL.revokeObjectURL(blobUrl)
        setBlobUrl(null)
        setBlob(null)
        setShareUrl('')
        setSharePassword('')
        setPhase('setup')
    }, [blobUrl])

    const handlePointerDown = (e) => {
        if (!compositorRef.current || activeTool === 'cursor') return
        const x = (e.clientX / window.innerWidth) * 1920
        const y = (e.clientY / window.innerHeight) * 1080
        compositorRef.current.startStroke(x, y, activeColor, 4)
    }

    const handlePointerMove = (e) => {
        if (!compositorRef.current || activeTool === 'cursor') return
        const x = (e.clientX / window.innerWidth) * 1920
        const y = (e.clientY / window.innerHeight) * 1080
        compositorRef.current.moveStroke(x, y)
    }

    const handlePointerUp = () => {
        compositorRef.current?.endStroke()
    }

    const isSetup = phase === 'setup'

    return (
        <div className="bg-black text-white font-manrope min-h-screen">
            <Navbar onStartNow={() => handleStart()} />

            <div className="fixed top-24 right-6 z-50 bg-[#ccfa00] text-black font-bold font-mono px-4 py-2 rounded-none skew-x-[-12deg] pointer-events-none min-w-[180px] text-right">
                {phase === 'recording' ? `REC_UPTIME: ${formatTime(elapsed)}` : `SYS_HEARTBEAT: ${syncRate.toFixed(2)} MS`}
            </div>

            {/* Drawing Overlay */}
            {isDrawingToolsVisible && activeTool !== 'cursor' && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 1000, cursor: 'crosshair',
                        touchAction: 'none'
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                />
            )}

            {/* Floating Bar */}
            {isDrawingToolsVisible && (
                <FloatingBar
                    onToolChange={setActiveTool}
                    onColorChange={setActiveColor}
                />
            )}

            <main className="flex flex-col gap-0 overflow-x-hidden">
                {isSetup ? (
                    <>
                        <Hero onStartRecording={handleStart} />
                        <Services delta={syncRate} />
                        <Work />
                        <Testimonials />
                        <Contact />
                    </>
                ) : (
                    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full relative z-[2001]">
                        <h1 className="text-7xl font-bold font-teko mb-8 text-center uppercase italic">
                            {phase === 'recording' && <><span className="text-[#ccfa00]">Recording</span> in progress</>}
                            {phase === 'preview' && <>Review your <span className="text-[#ccfa00]">recording</span></>}
                            {phase === 'uploading' && <>Uploading your <span className="text-[#ccfa00]">clip</span>...</>}
                            {phase === 'share' && <>Your clip is <span className="text-[#ccfa00]">live!</span></>}
                        </h1>
                    </div>
                )}

                {/* Recorder Panel */}
                <div id="recorder-panel" className="relative z-[2001] w-full max-w-4xl mx-auto px-6 mb-32">
                    <StepIndicator current={STEP_NUM[phase]} />

                    {phase === 'setup' && <SetupPanel onStart={handleStart} />}
                    {phase === 'recording' && (
                        <RecordingPanel
                            elapsed={elapsed}
                            isPaused={isPaused}
                            onStop={handleStop}
                            onPause={handlePause}
                            onCancel={handleCancel}
                        />
                    )}
                    {phase === 'preview' && (
                        <PreviewPanel blobUrl={blobUrl} onUpload={handleUpload} onReRecord={handleReRecord} />
                    )}
                    {phase === 'uploading' && (
                        <UploadPanel progress={uploadProgress} loaded={uploadLoaded} total={uploadTotal} />
                    )}
                    {phase === 'share' && (
                        <SharePanel shareUrl={shareUrl} password={sharePassword} onNewRecording={handleNewRecording} />
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
