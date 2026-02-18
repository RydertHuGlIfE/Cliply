// ─── uploader.js — Pure ES module ─────────────────────────────────────────────

/**
 * Upload a recorded blob to the Flask backend.
 * @param {Blob} blob
 * @param {{ onProgress: (pct: number, loaded: number, total: number) => void }} opts
 * @returns {Promise<{ id: string, shareUrl: string, size: number }>}
 */
export function uploadBlob(blob, { onProgress } = {}) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('video', blob, 'recording.webm');

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('loadstart', () => onProgress?.(0, 0, blob.size));

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const pct = Math.round((e.loaded / e.total) * 100);
                onProgress?.(pct, e.loaded, e.total);
            }
        });

        xhr.upload.addEventListener('load', () => onProgress?.(100, blob.size, blob.size));

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    resolve(JSON.parse(xhr.responseText));
                } catch {
                    reject(new Error('Invalid server response'));
                }
            } else {
                reject(new Error(`Server error: ${xhr.status}`));
            }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error')));
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

        xhr.open('POST', '/upload');
        xhr.send(formData);
    });
}

export function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
