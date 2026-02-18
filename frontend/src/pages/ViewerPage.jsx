import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import VideoPlayer from '../components/VideoPlayer'

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatTime(seconds) {
    if (seconds <= 0) return 'Expired'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
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

export default function ViewerPage() {
    const { id } = useParams()
    const [status, setStatus] = useState('loading') // loading | ready | notfound
    const [info, setInfo] = useState(null)
    const [copied, setCopied] = useState(false)
    const [password, setPassword] = useState('')
    const [token, setToken] = useState(null)
    const [error, setError] = useState(null)
    const [ttl, setTtl] = useState(null)
    const inputRef = useRef(null)

    const shareUrl = window.location.href

    useEffect(() => {
        if (!id) { setStatus('notfound'); return }
        document.title = `SnapRec — Recording ${id.slice(0, 8)}`

        let interval;
        fetch(`/api/video/${id}/info`)
            .then(r => {
                if (!r.ok) throw new Error('not found')
                return r.json()
            })
            .then(data => {
                setInfo(data);
                setStatus('ready');
                if (data.ttl) {
                    setTtl(data.ttl);
                    interval = setInterval(() => {
                        setTtl(t => {
                            if (t <= 1) {
                                clearInterval(interval);
                                setStatus('notfound'); // Expired!
                                return 0;
                            }
                            return t - 1;
                        });
                    }, 1000);
                }
            })
            .catch(() => setStatus('notfound'))

        return () => clearfix(interval);

        function clearfix(videoInterval) {
            if (videoInterval) clearInterval(videoInterval);
        }
    }, [id])

    const handleVerify = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch(`/api/video/${id}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setToken(data.token);
            } else {
                setError(data.error || 'Incorrect password');
            }
        } catch (err) {
            setError('Verification failed');
        }
    }

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            showToast('Link copied!', 'success')
        }).catch(() => {
            inputRef.current?.select()
            document.execCommand('copy')
            showToast('Link copied!', 'success')
        })
    }

    const rightSlot = (
        <Link to="/" className="btn btn-secondary btn-sm">🔴 New Recording</Link>
    )

    return (
        <div>
            <Header rightSlot={rightSlot} />
            <main style={{ padding: '40px 0 60px' }}>
                <div className="container">

                    {status === 'loading' && (
                        <div className="text-center" style={{ padding: '80px 0' }}>
                            <div className="spinner" style={{ margin: '0 auto 16px' }} />
                            <p className="text-secondary">Loading recording...</p>
                        </div>
                    )}

                    {status === 'notfound' && (
                        <div className="text-center" style={{ padding: '80px 24px' }}>
                            <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
                            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Recording Not Found</h2>
                            <p className="text-secondary" style={{ marginBottom: 28 }}>
                                This recording may have been deleted or the link is invalid.
                            </p>
                            <Link to="/" className="btn btn-primary">🔴 Make a New Recording</Link>
                        </div>
                    )}

                    {status === 'ready' && (
                        <div className="animate-in">
                            {!token ? (
                                <div className="card" style={{ maxWidth: 400, margin: '40px auto', textAlign: 'center', padding: 40 }}>
                                    <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
                                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Password Protected</h2>
                                    <p className="text-secondary mb-24">
                                        Enter the password to view this recording.<br />
                                        {ttl !== null && (
                                            <span style={{ fontSize: 13, color: '#eab308' }}>
                                                Time remaining: {formatTime(ttl)}
                                            </span>
                                        )}
                                    </p>
                                    <form onSubmit={handleVerify}>
                                        <input
                                            type="text"
                                            className="share-link-input mb-16"
                                            placeholder="Enter password..."
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: 1 }}
                                            autoFocus
                                        />
                                        {error && <div className="text-danger mb-16" style={{ fontSize: 14 }}>{error}</div>}
                                        <button type="submit" className="btn btn-primary w-full">Unlock Recording</button>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    <VideoPlayer videoId={id} token={token} />

                                    {/* Info bar */}
                                    <div className="flex justify-between items-center flex-wrap gap-12 mt-24">
                                        <div className="flex items-center gap-16 flex-wrap">
                                            <div className="flex items-center gap-8" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                                🎬 <strong style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-primary)' }}>{id}</strong>
                                            </div>
                                            {info?.size && (
                                                <div className="flex items-center gap-8" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                                    💾 <strong style={{ color: 'var(--text-primary)' }}>{formatBytes(info.size)}</strong>
                                                </div>
                                            )}
                                            {ttl !== null && (
                                                <div className="flex items-center gap-8" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                                    ⏳ <strong style={{ color: '#eab308' }}>{formatTime(ttl)}</strong>
                                                </div>
                                            )}
                                        </div>
                                        <a href={`/video/${id}?token=${token}`} download={`snaprec-${id}.webm`} className="btn btn-download btn-sm">
                                            ⬇ Download
                                        </a>
                                    </div>

                                    {/* Share box */}
                                    <div className="card mt-24">
                                        <p className="section-title mb-12">Share this recording</p>
                                        <div className="share-link-box">
                                            <input ref={inputRef} type="text" className="share-link-input" value={shareUrl} readOnly />
                                            <button
                                                className={`btn btn-sm ${copied ? 'btn-success' : 'btn-primary'}`}
                                                onClick={copyLink}
                                            >
                                                {copied ? '✅ Copied!' : '📋 Copy'}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
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
