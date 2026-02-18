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
                    <div className="flex items-center gap-12">
                        {status && (
                            <div className={`badge badge-${status.type}`}>
                                {status.type === 'recording' && <span className="dot" />}
                                <span>{status.label}</span>
                            </div>
                        )}
                        {rightSlot}
                    </div>
                </div>
            </div>
        </header>
    )
}
