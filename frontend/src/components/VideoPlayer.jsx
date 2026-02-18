import { useRef, useEffect, useState } from 'react'

export default function VideoPlayer({ videoId, token }) {
    const videoRef = useRef(null)
    const [buffering, setBuffering] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        const onCanPlay = () => setBuffering(false)
        const onWaiting = () => setBuffering(true)
        const onPlaying = () => setBuffering(false)
        const onError = () => { setBuffering(false); setError(true) }
        video.addEventListener('canplay', onCanPlay)
        video.addEventListener('waiting', onWaiting)
        video.addEventListener('playing', onPlaying)
        video.addEventListener('error', onError)
        return () => {
            video.removeEventListener('canplay', onCanPlay)
            video.removeEventListener('waiting', onWaiting)
            video.removeEventListener('playing', onPlaying)
            video.removeEventListener('error', onError)
        }
    }, [])

    return (
        <div className="video-container">
            <video
                ref={videoRef}
                src={token ? `/video/${videoId}?token=${token}` : undefined}
                controls
                preload="metadata"
                playsInline
            />
            {buffering && !error && (
                <div className="video-loading">
                    <div className="spinner" />
                    <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Buffering...</span>
                </div>
            )}
            {error && (
                <div className="video-error">
                    <span style={{ fontSize: 48 }}>⚠️</span>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>Playback Error</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Could not load this recording</span>
                </div>
            )}
        </div>
    )
}
