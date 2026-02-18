import { useState, useRef } from 'react'

export default function SharePanel({ shareUrl, password, onNewRecording }) {
    const [copied, setCopied] = useState(false)
    const [passwordCopied, setPasswordCopied] = useState(false)
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

    const copyPassword = () => {
        navigator.clipboard.writeText(password).then(() => {
            setPasswordCopied(true)
            setTimeout(() => setPasswordCopied(false), 2000)
        })
    }

    return (
        <div className="card animate-in border-t-0 p-0 overflow-hidden">
            <div className="bg-[#ccfa00] text-black px-6 py-2 font-teko text-xl italic font-bold skew-x-[-12deg] inline-block mb-8 ml-6">
                UPLINK_SUCCESSFUL
            </div>

            <div className="px-10 pb-10">
                <div className="text-center mb-10">
                    <div className="font-teko text-6xl uppercase italic text-[#ccfa00] leading-none mb-4">Stream is Live</div>
                    <p className="font-mono text-xs uppercase opacity-50">Neural data transmission complete.</p>
                </div>

                {password && (
                    <div className="mb-10 p-6 bg-black border border-[#222] relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#ccfa00] text-black px-2 py-1 font-teko text-xs skew-x-[-12deg]">
                            ENCRYPTION_KEY
                        </div>
                        <div className="flex items-center justify-between gap-6 pt-4">
                            <code className="font-mono text-4xl font-bold tracking-[0.2em] text-[#ccfa00]">
                                {password}
                            </code>
                            <button
                                className={`btn ${passwordCopied ? 'bg-white text-black' : 'btn-secondary'} !transform-none !skew-x-0`}
                                onClick={copyPassword}
                                style={{ padding: '8px 16px' }}
                            >
                                {passwordCopied ? 'OK' : 'COPY'}
                            </button>
                        </div>
                        <p className="font-mono text-[10px] uppercase opacity-40 mt-4 leading-relaxed">
                            [SECURITY_PROTOCOL]: Clip auto-purges in 15 minutes to prevent data leakage.
                        </p>
                    </div>
                )}

                <div className="share-link-box mb-10">
                    <input ref={inputRef} type="text" className="share-link-input" value={shareUrl} readOnly />
                    <button
                        className={`btn ${copied ? 'bg-white text-black' : 'btn-primary'} !transform-none !skew-x-0`}
                        onClick={copyLink}
                        style={{ padding: '0 24px', height: '100%' }}
                    >
                        {copied ? 'COPIED' : 'COPY_LINK'}
                    </button>
                </div>

                <div className="flex gap-4">
                    <a href={shareUrl} target="_blank" rel="noreferrer" className="btn btn-secondary flex-1">
                        VIEW_STREAM
                    </a>
                    <button className="btn btn-secondary flex-1" onClick={onNewRecording}>
                        RESET_MODULE
                    </button>
                </div>
            </div>
        </div>
    )
}
