export default function PreviewPanel({ blobUrl, onUpload, onReRecord }) {
    return (
        <div className="card animate-in border-t-0 p-0 overflow-hidden">
            <div className="bg-[#ccfa00] text-black px-6 py-2 font-teko text-xl italic font-bold skew-x-[-12deg] inline-block mb-8 ml-6">
                BUFFER_PREVIEW
            </div>

            <div className="px-10 pb-10">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="font-teko text-4xl uppercase italic leading-none">Review Feed</h2>
                    <button className="btn btn-secondary btn-sm" onClick={onReRecord}>PURGE & RE-RECORD</button>
                </div>

                <video className="video-preview mb-10" src={blobUrl} controls />

                <button className="btn btn-primary w-full py-6 text-3xl" onClick={onUpload}>
                    COMMIT_TO_UPLINK
                </button>

                <p className="font-mono text-[10px] uppercase opacity-40 mt-6 text-center tracking-[0.2em]">
                    Verify stream integrity before final transmission.
                </p>
            </div>
        </div>
    )
}
