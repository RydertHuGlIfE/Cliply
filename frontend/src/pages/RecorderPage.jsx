import { useState, useEffect, useRef, useCallback } from 'react'
import Header from '../components/Header'
import StepIndicator from '../components/StepIndicator'
import SetupPanel from '../components/SetupPanel'
import RecordingPanel from '../components/RecordingPanel'
import PreviewPanel from '../components/PreviewPanel'
import UploadPanel from '../components/UploadPanel'
import SharePanel from '../components/SharePanel'
import { startRecording, stopRecording, pauseRecording, resumeRecording } from '../modules/recorder'
import { uploadBlob } from '../modules/uploader'

// State machine: setup → recording → preview → uploading → share
const STEP_NUM = { setup: 1, recording: 2, preview: 2, uploading: 3, share: 3 }

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

function TerminalVisual() {
    return (
        <div className="hero-visual animate-in-scale">
            <div className="terminal-card">
                <div className="terminal-titlebar">
                    <div className="terminal-dots">
                        <div className="terminal-dot red" />
                        <div className="terminal-dot yellow" />
                        <div className="terminal-dot green" />
                    </div>
                    <span className="terminal-status">CONNECTED_01</span>
                </div>
                <div className="terminal-body">
                    <div className="terminal-panel">
                        <div className="terminal-lines">
                            <div className="terminal-line" />
                            <div className="terminal-line" />
                            <div className="terminal-line" />
                        </div>
                    </div>
                    <div className="terminal-panel">
                        <div className="terminal-ring-wrap">
                            <div className="terminal-ring" />
                        </div>
                    </div>
                </div>
                <div className="terminal-footer">
                    <div className="terminal-footer-dot" />
                    <span className="terminal-footer-text">REC</span>
                </div>
            </div>
        </div>
    )
}

export default function RecorderPage() {
    const [phase, setPhase] = useState('setup') // setup | recording | preview | uploading | share
    const [isPaused, setIsPaused] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const [blobUrl, setBlobUrl] = useState(null)
    const [blob, setBlob] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadLoaded, setUploadLoaded] = useState(0)
    const [uploadTotal, setUploadTotal] = useState(0)
    const [shareUrl, setShareUrl] = useState('')
    const [sharePassword, setSharePassword] = useState('')

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

    useEffect(() => () => stopTimer(), [])

    const statusMap = {
        setup: { label: 'System Operational', type: 'idle' },
        recording: { label: 'Recording', type: 'recording' },
        preview: { label: 'Preview Ready', type: 'idle' },
        uploading: { label: 'Uploading...', type: 'idle' },
        share: { label: 'Shared!', type: 'ready' },
    }

    const handleStart = useCallback(async ({ useMic, useSystemAudio }) => {
        const result = await startRecording({
            useMic,
            useSystemAudio,
            onChunk: () => { },
            onStop: (recordedBlob) => {
                const url = URL.createObjectURL(recordedBlob)
                setBlobUrl(url)
                setBlob(recordedBlob)
                stopTimer()
                setPhase('preview')
            },
            onError: (err) => {
                stopTimer()
                setPhase('setup')
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
            startTimer()
            if (result.warning === 'system_audio_missing') {
                showToast('System audio missing. Try sharing a "Tab" instead of "Entire Screen".', 'error')
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

    const isSetup = phase === 'setup'

    return (
        <div>
            <Header status={statusMap[phase]} />
            <main>
                <div className="container">
                    {/* Hero — shown only on setup phase */}
                    {isSetup ? (
                        <section className="hero-section" id="features">
                            <div className="hero-text animate-in">
                                <div className="hero-status-pill">
                                    <span className="hero-status-dot" />
                                    System Operational
                                </div>
                                <h1 className="hero-headline">
                                    Record. Share.{' '}
                                    <span className="accent">Instantly.</span>
                                </h1>
                                <p className="hero-sub">
                                    Capture your screen with audio in one click. Get a shareable link in seconds — no installs, no sign-up.
                                </p>
                                <div className="hero-actions">
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={() => document.getElementById('recorder-panel')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        🔴 Start Recording
                                    </button>
                                    <a href="#how-it-works" className="btn btn-secondary btn-lg">
                                        Watch Demo
                                    </a>
                                </div>
                            </div>
                            <TerminalVisual />
                        </section>
                    ) : (
                        <section style={{ padding: '48px 0 32px', textAlign: 'center' }}>
                            <h1 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 8 }}>
                                {phase === 'recording' && <><span className="accent">Recording</span> in progress</>}
                                {phase === 'preview' && <>Review your <span className="accent">recording</span></>}
                                {phase === 'uploading' && <>Uploading your <span className="accent">clip</span>...</>}
                                {phase === 'share' && <>Your clip is <span className="accent">live!</span></>}
                            </h1>
                        </section>
                    )}

                    {/* Recorder panel */}
                    <div id="recorder-panel" style={{ maxWidth: 680, margin: '0 auto' }}>
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

                    {/* How it works */}
                    {isSetup && (
                        <div className="how-it-works" id="how-it-works">
                            <p className="how-it-works-title">How it works</p>
                            <div className="how-it-works-grid">
                                {[
                                    { icon: '🖥️', title: 'Select Screen', desc: 'Choose any screen, window, or browser tab to capture' },
                                    { icon: '⚡', title: 'Instant Upload', desc: 'Recording uploads automatically when you stop' },
                                    { icon: '🔗', title: 'Share Link', desc: 'One-click copy of your password-protected shareable link' },
                                ].map(({ icon, title, desc }) => (
                                    <div key={title} className="how-card">
                                        <div className="how-card-icon">{icon}</div>
                                        <div className="how-card-title">{title}</div>
                                        <div className="how-card-desc">{desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <footer className="footer">
                <div className="container">
                    <p>Built with ❤️ using the Web Screen Capture API</p>
                </div>
            </footer>
        </div>
    )
}
