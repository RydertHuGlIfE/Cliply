import { Link } from 'react-router-dom'

export default function Header({ rightSlot, status }) {
    return (
        <header className="header">
            <div className="container">
                <div className="header-inner">
                    <Link to="/" className="logo">
                    </Link>

                    <nav className="header-nav">
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
