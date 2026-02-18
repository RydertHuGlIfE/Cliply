// ─── recorder.js — Pure ES module, no React deps ─────────────────────────────

let mediaRecorder = null;
let screenStream = null;
let micStream = null;
let stopTimeout = null;

// Persistent state for recovery
let recordedChunks = [];
let recordedMimeType = '';
let onStopCallback = null;

export function getSupportedMimeType(hasAudio) {
    const types = hasAudio ? [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
    ] : [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
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
    console.log('[Recorder] startRecording', { useMic, useSystemAudio });

    // Reset state
    recordedChunks = [];
    recordedMimeType = '';
    onStopCallback = onStop;

    try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { frameRate: 30, width: { ideal: 1920 }, height: { ideal: 1080 } },
            audio: useSystemAudio,
        });

        const audioTracks = [...(screenStream.getAudioTracks())];
        console.log('[Recorder] screenStream tracks:', screenStream.getTracks());

        if (useMic) {
            try {
                micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                audioTracks.push(...micStream.getAudioTracks());
                console.log('[Recorder] micStream tracks:', micStream.getTracks());
            } catch (err) {
                console.warn('[Recorder] mic access denied or failed', err);
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
            finalStream = new MediaStream([...screenStream.getVideoTracks(), ...audioTracks]);
        }

        const hasAudio = finalStream.getAudioTracks().length > 0;
        recordedMimeType = getSupportedMimeType(hasAudio);
        console.log('[Recorder] Final stream tracks:', finalStream.getTracks(), 'Mime:', recordedMimeType, 'Has Audio:', hasAudio);

        mediaRecorder = new MediaRecorder(finalStream, { mimeType: recordedMimeType, videoBitsPerSecond: 3_000_000 });

        mediaRecorder.ondataavailable = (e) => {
            if (e.data?.size > 0) {
                recordedChunks.push(e.data);
                onChunk?.(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            // Validate if we have content
            console.log('[Recorder] onstop fired. Chunks count:', recordedChunks.length);
            finishRecording();
        };

        mediaRecorder.onerror = (e) => {
            console.error('[Recorder] MediaRecorder error:', e);
            onError(e.error || new Error('MediaRecorder unknown error'));
        };

        // Handle user closing the share dialog
        screenStream.getVideoTracks()[0].onended = () => {
            console.log('[Recorder] Screen track ended (user stopped share)');
            if (mediaRecorder?.state !== 'inactive') stopRecording();
        };

        if (useSystemAudio && !hasAudio && !useMic) {
            console.warn('[Recorder] System audio requested but no audio track received. User likely did not select "Share Audio".');
        }

        mediaRecorder.start(1000);
        console.log('[Recorder] mediaRecorder started. State:', mediaRecorder.state);
        return {
            mimeType: recordedMimeType,
            warning: (useSystemAudio && !hasAudio && !useMic) ? 'system_audio_missing' : null
        };
    } catch (err) {
        console.error('[Recorder] Critical error in startRecording:', err);
        onError(err);
        return null;
    }
}

export function stopRecording() {
    console.log('[Recorder] stopRecording called. Current state:', mediaRecorder?.state);

    // Clear any existing timeout just in case
    if (stopTimeout) clearTimeout(stopTimeout);

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        try {
            mediaRecorder.stop();
            // Fallback: If onstop doesn't fire in 1s, force cleanup
            stopTimeout = setTimeout(() => {
                console.warn('[Recorder] onstop timed out. Forcing finishRecording.');
                finishRecording();
            }, 1000);
        } catch (err) {
            console.error('[Recorder] Failed to call mediaRecorder.stop():', err);
            finishRecording();
        }
    } else {
        console.log('[Recorder] Recorder already inactive, forcing finish logic.');
        finishRecording();
    }
}

function finishRecording() {
    console.log('[Recorder] finishRecording called');
    if (stopTimeout) {
        clearTimeout(stopTimeout);
        stopTimeout = null;
    }

    _stopStreams();

    // Construct blob if we have data
    if (recordedChunks.length > 0 && onStopCallback) {
        const blob = new Blob(recordedChunks, { type: recordedMimeType });
        console.log('[Recorder] Created blob size:', blob.size);
        onStopCallback(blob, recordedMimeType);

        // Clear callback to prevent double firing
        onStopCallback = null;
    } else {
        console.warn('[Recorder] No chunks recorded or callback missing');
    }
}

export function pauseRecording() {
    if (mediaRecorder?.state === 'recording') mediaRecorder.pause();
}

export function resumeRecording() {
    if (mediaRecorder?.state === 'paused') mediaRecorder.resume();
}

function _stopStreams() {
    console.log('[Recorder] _stopStreams called');
    [screenStream, micStream].forEach((s) => s?.getTracks()?.forEach((t) => t.stop()));

    screenStream = null;
    micStream = null;
    mediaRecorder = null; // Clear recorder ref
}
