import { Link } from 'react-router-dom'

export default function Header({ rightSlot, status }) {
    return (
        <header className="header">
            <div className="container">
                <div className="header-inner">
                    <Link to="/" className="logo">
                        <div className="logo-icon">🎬</div>
                        <span className="logo-text">Cliply</span>
                    </Link>

                    <nav className="header-nav">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How it works</a>
                    </nav>

                    <div className="flex items-center gap-12">
                        {status && (
                            <div className={`badge badge-${status.type}`}>
                                {status.type === 'recording'
                                    ? <><span className="dot" /><span>{status.label}</span></>
                                    : <><span className="hero-status-dot" style={{ width: 7, height: 7, margin: 0 }} /><span>{status.label}</span></>
                                }
                            </div>
                        )}
                        {rightSlot}
                    </div>
                </div>
            </div>
        </header>
    )
}
