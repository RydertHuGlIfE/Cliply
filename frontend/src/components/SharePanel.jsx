import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SharePanel({ shareUrl, onNewRecording }) {
    const [copied, setCopied] = useState(false)
    const inputRef = useRef(null)

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }).catch(() => {
            inputRef.current?.select()
            document.execCommand('copy')
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    return (
        <div className="card animate-in">
            <div className="text-center">
                <div style={{
                    width: 64, height: 64, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, margin: '0 auto 20px', animation: 'fadeInScale 0.4s cubic-bezier(0.4,0,0.2,1)'
                }}>✅</div>

                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Your recording is ready!</h3>
                <p className="text-secondary mb-24" style={{ fontSize: 14 }}>Share this link with anyone</p>

                <div className="share-link-box mb-16">
                    <input ref={inputRef} type="text" className="share-link-input" value={shareUrl} readOnly />
                    <button
                        className={`btn btn-sm ${copied ? 'btn-success' : 'btn-primary'}`}
                        onClick={copyLink}
                    >
                        {copied ? '✅ Copied!' : '📋 Copy'}
                    </button>
                </div>

                <div className="flex gap-12 justify-center flex-wrap">
                    <a href={shareUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                        ▶ Open Viewer
                    </a>
                    <button className="btn btn-secondary btn-sm" onClick={onNewRecording}>
                        🔴 New Recording
                    </button>
                </div>
            </div>
        </div>
    )
}
