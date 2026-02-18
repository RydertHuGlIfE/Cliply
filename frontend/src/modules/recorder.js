// ─── recorder.js — Pure ES module, no React deps ─────────────────────────────

let mediaRecorder = null;
let screenStream = null;
let micStream = null;
let camStream = null;
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
export async function startRecording({ useMic, useSystemAudio, useCamera, compositor, onChunk, onStop, onError }) {
    console.log('[Recorder] startRecording', { useMic, useSystemAudio, useCamera });

    // Reset state
    recordedChunks = [];
    recordedMimeType = '';
    onStopCallback = onStop;

    try {
        const displayMediaConstraints = {
            video: { frameRate: 60, width: { ideal: 1920 }, height: { ideal: 1080 } },
            audio: useSystemAudio ? {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
                // sampleRate: 44100, // Let browser decide to avoid mismatch
            } : false,
        };
        console.log('[Recorder] Requesting DisplayMedia with:', displayMediaConstraints);
        screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaConstraints);

        const audioTracks = [...(screenStream.getAudioTracks())];
        console.log('[Recorder] screenStream tracks:', screenStream.getTracks());
        audioTracks.forEach(t => console.log('[Recorder] audio track settings:', t.getSettings()));

        if (useMic) {
            try {
                micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                audioTracks.push(...micStream.getAudioTracks());
                console.log('[Recorder] micStream tracks:', micStream.getTracks());
            } catch (err) {
                console.warn('[Recorder] mic access denied or failed', err);
            }
        }

        // Module-level scope
        // Module-level scope
        // let camStream = null; (Using module scope now)

        if (useCamera) {
            try {
                camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                console.log('[Recorder] camStream tracks:', camStream.getTracks());
            } catch (err) {
                console.warn('[Recorder] camera access denied or failed', err);
            }
        }

        let finalStream;
        if (compositor) {
            // Start compositor with both streams if camera is active
            const canvasStream = compositor.start(screenStream, camStream);
            finalStream = new MediaStream([...canvasStream.getVideoTracks()]);
        } else {
            finalStream = new MediaStream([...screenStream.getVideoTracks()]);
        }

        if (audioTracks.length > 0) {
            const ctx = new AudioContext();
            const dest = ctx.createMediaStreamDestination();

            // Keep references to prevent GC?
            window._audioContext = ctx;

            audioTracks.forEach((track) => {
                const source = ctx.createMediaStreamSource(new MediaStream([track]));
                const gainNode = ctx.createGain(); // Use gain node to ensure flow
                gainNode.gain.value = 1.0;
                source.connect(gainNode);
                gainNode.connect(dest);

                // Force graph activity by connecting to destination (muted)
                const silentGain = ctx.createGain();
                silentGain.gain.value = 0; // Muted to prevent echo
                source.connect(silentGain);
                silentGain.connect(ctx.destination);

                console.log(`[Recorder] Connected track ${track.id} to AudioContext (and loopback). Muted: ${track.muted}, Enabled: ${track.enabled}`);
            });

            if (ctx.state === 'suspended') {
                console.log('[Recorder] AudioContext suspended, resizing...');
                await ctx.resume();
            }

            // Comfort Noise: Add a tiny bit of noise to keep the encoder/context alive
            // System audio is often silent/sporadic, which can cause MediaRecorder to stall.
            // A continuous low-level signal ensures the audio track has data.
            const oscillator = ctx.createOscillator();
            const comfortGain = ctx.createGain();
            comfortGain.gain.value = 0.001; // Inaudible (-60dB) but present
            oscillator.connect(comfortGain);
            comfortGain.connect(dest);
            oscillator.start();
            console.log('[Recorder] Added comfort noise generator.');

            console.log('[Recorder] AudioContext state:', ctx.state);

            finalStream = new MediaStream([...finalStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
        } else {
            // Video only - finalStream already has the correct video tracks
        }

        const hasAudio = finalStream.getAudioTracks().length > 0;
        recordedMimeType = getSupportedMimeType(hasAudio);
        console.log('[Recorder] Final stream tracks:', finalStream.getTracks(), 'Mime:', recordedMimeType, 'Has Audio:', hasAudio);

        mediaRecorder = new MediaRecorder(finalStream, { mimeType: recordedMimeType, videoBitsPerSecond: 20_000_000 });

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
            warning: (useSystemAudio && !hasAudio && !useMic) ? 'system_audio_missing' : null,
            camStream: camStream
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
    [screenStream, micStream, camStream].forEach((s) => s?.getTracks()?.forEach((t) => t.stop()));

    screenStream = null;
    micStream = null;
    camStream = null;
    mediaRecorder = null; // Clear recorder ref
}
