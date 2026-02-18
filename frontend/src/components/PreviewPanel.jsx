export default function PreviewPanel({ blobUrl, onUpload, onReRecord }) {
    return (
        <div className="card animate-in">
            <div className="flex justify-between items-center mb-24">
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Preview</h2>
                <div className="flex gap-8">
                    <button className="btn btn-secondary btn-sm" onClick={onReRecord}>↩ Re-record</button>
                    <button className="btn btn-primary btn-sm" onClick={onUpload}>⬆ Upload & Share</button>
                </div>
            </div>
            <video className="video-preview" src={blobUrl} controls />
            <p className="text-secondary mt-12 text-center" style={{ fontSize: 13 }}>
                Review your recording before sharing
            </p>
        </div>
    )
}
