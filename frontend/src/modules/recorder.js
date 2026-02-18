// ─── recorder.js — Pure ES module, no React deps ─────────────────────────────

let mediaRecorder = null;
let screenStream = null;
let micStream = null;

export function getSupportedMimeType() {
    const types = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
    ];
    return types.find((t) => MediaRecorder.isTypeSupported(t)) || '';
}

/**
 * Start recording.
 * @param {{ useMic: boolean, useSystemAudio: boolean, onChunk: (blob: Blob) => void, onStop: (blob: Blob, mimeType: string) => void, onError: (err: Error) => void }} opts
 */
export async function startRecording({ useMic, useSystemAudio, onChunk, onStop, onError }) {
    try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { frameRate: 30, width: { ideal: 1920 }, height: { ideal: 1080 } },
            audio: useSystemAudio,
        });

        const audioTracks = [...(screenStream.getAudioTracks())];

        if (useMic) {
            try {
                micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                audioTracks.push(...micStream.getAudioTracks());
            } catch {
                // mic denied — continue without it
            }
        }

        let finalStream;
        if (audioTracks.length > 1) {
            const ctx = new AudioContext();
            const dest = ctx.createMediaStreamDestination();
            audioTracks.forEach((track) => {
                ctx.createMediaStreamSource(new MediaStream([track])).connect(dest);
            });
            finalStream = new MediaStream([...screenStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
        } else {
            finalStream = new MediaStream([...screenStream.getVideoTracks(), ...audioTracks]);
        }

        const mimeType = getSupportedMimeType();
        const chunks = [];

        mediaRecorder = new MediaRecorder(finalStream, { mimeType, videoBitsPerSecond: 3_000_000 });

        mediaRecorder.ondataavailable = (e) => {
            if (e.data?.size > 0) {
                chunks.push(e.data);
                onChunk?.(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: mimeType });
            onStop(blob, mimeType);
        };

        // Handle user closing the share dialog
        screenStream.getVideoTracks()[0].onended = () => {
            if (mediaRecorder?.state !== 'inactive') stopRecording();
        };

        mediaRecorder.start(1000);
        return { mimeType };
    } catch (err) {
        onError(err);
        return null;
    }
}

export function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    _stopStreams();
}

export function pauseRecording() {
    if (mediaRecorder?.state === 'recording') mediaRecorder.pause();
}

export function resumeRecording() {
    if (mediaRecorder?.state === 'paused') mediaRecorder.resume();
}

function _stopStreams() {
    [screenStream, micStream].forEach((s) => s?.getTracks().forEach((t) => t.stop()));
    screenStream = null;
    micStream = null;
}
