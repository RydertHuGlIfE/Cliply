import { formatBytes } from '../modules/uploader'

export default function UploadPanel({ progress, loaded, total }) {
    return (
        <div className="card animate-in">
            <div className="text-center">
                <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>⬆️</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Uploading...</h3>
                <p className="text-secondary mb-24" style={{ fontSize: 14 }}>Your recording is being uploaded</p>

                <div className="flex justify-between mb-8" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span>
                        {loaded > 0 ? `${formatBytes(loaded)} / ${formatBytes(total)}` : 'Preparing...'}
                    </span>
                    <span>{progress}%</span>
                </div>
                <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
            </div>
        </div>
    )
}
