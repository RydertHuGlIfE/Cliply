import os
import uuid
import secrets
import hashlib
import time
import threading
from flask import Flask, request, jsonify, Response, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_UPLOAD_SIZE = 2 * 1024 * 1024 * 1024  # 1 GB

# In-memory storage for video metadata
# video_id -> { filepath, password_hash, created_at, size }
VIDEOS = {}

# Session tokens for authorized viewing
# token -> { video_id, expires_at }
TOKENS = {}

# ── Cleanup Task ──────────────────────────────────────────────────────────────
def cleanup_loop():
    """Background thread to delete videos older than 15 minutes."""
    while True:
        try:
            now = time.time()
            expiry_age = 15 * 60  # 15 minutes
            
            # Identify expired videos
            expired_ids = [
                vid for vid, data in VIDEOS.items()
                if now - data['created_at'] > expiry_age
            ]
            
            # Delete valid expired videos
            for vid in expired_ids:
                data = VIDEOS.pop(vid, None)
                if data and os.path.exists(data['filepath']):
                    try:
                        os.remove(data['filepath'])
                        print(f"[cleanup] Deleted expired video {vid}")
                    except Exception as e:
                        print(f"[cleanup] Error deleting {vid}: {e}")

            # Identify orphaned files (files not in VIDEOS map)
            # This handles files from previous server runs
            # Note: This might be aggressive, but ensures cleanup.
            for filename in os.listdir(UPLOAD_DIR):
                filepath = os.path.join(UPLOAD_DIR, filename)
                if not filename.endswith('.webm'): continue
                
                # Check if file is tracked
                video_id = filename.replace('.webm', '')
                if video_id not in VIDEOS:
                    # Check file age on disk
                    file_age = now - os.path.getmtime(filepath)
                    if file_age > expiry_age:
                        try:
                            os.remove(filepath)
                            print(f"[cleanup] Deleted orphaned file {filename}")
                        except Exception as e:
                            print(f"[cleanup] Error deleting orphan {filename}: {e}")

            # Cleanup expired tokens
            expired_tokens = [t for t, d in TOKENS.items() if now > d['expires_at']]
            for t in expired_tokens:
                TOKENS.pop(t, None)

        except Exception as e:
            print(f"[cleanup] Error in loop: {e}")
        
        time.sleep(60)

# Start background thread
threading.Thread(target=cleanup_loop, daemon=True).start()


# ── Upload ────────────────────────────────────────────────────────────────────
@app.route("/upload", methods=["POST"])
def upload_video():
    if "video" not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    file = request.files["video"]
    video_id = str(uuid.uuid4())
    filename = f"{video_id}.webm"
    filepath = os.path.join(UPLOAD_DIR, filename)

    file.save(filepath)
    size = os.path.getsize(filepath)

    # Generate Secure Password
    password = secrets.token_urlsafe(6)  # e.g., "Xu8_A9s"
    password_hash = hashlib.sha256(password.encode()).hexdigest()

    VIDEOS[video_id] = {
        "filepath": filepath,
        "password_hash": password_hash,
        "created_at": time.time(),
        "size": size
    }

    share_url = f"http://localhost:5173/view/{video_id}"

    print(f"[upload] {video_id} — {size / 1024 / 1024:.2f} MB")
    return jsonify({
        "id": video_id, 
        "shareUrl": share_url, 
        "size": size,
        "password": password  # Return raw password ONCE to user
    })


# ── Verify Password ───────────────────────────────────────────────────────────
@app.route("/api/video/<video_id>/verify", methods=["POST"])
def verify_password(video_id):
    data = request.json
    password = data.get("password")
    
    if video_id not in VIDEOS:
        return jsonify({"error": "Video not found or expired"}), 404
        
    video = VIDEOS[video_id]
    input_hash = hashlib.sha256(password.encode()).hexdigest()
    
    if input_hash == video['password_hash']:
        # Generate temporary access token
        token = secrets.token_urlsafe(16)
        TOKENS[token] = { "video_id": video_id, "expires_at": time.time() + 3600 }
        return jsonify({"success": True, "token": token})
    
    return jsonify({"error": "Incorrect password"}), 401


# ── Stream video (with Range support) ─────────────────────────────────────────
@app.route("/video/<video_id>")
def stream_video(video_id):
    # Security Check
    token = request.args.get("token")
    if not token or token not in TOKENS or TOKENS[token]["video_id"] != video_id:
        return jsonify({"error": "Unauthorized"}), 403

    safe_id = "".join(c for c in video_id if c.isalnum() or c == "-")
    filepath = os.path.join(UPLOAD_DIR, f"{safe_id}.webm")

    if not os.path.isfile(filepath):
        return jsonify({"error": "Video not found"}), 404

    file_size = os.path.getsize(filepath)
    range_header = request.headers.get("Range")

    if range_header:
        # Parse "bytes=start-end"
        byte_range = range_header.replace("bytes=", "").split("-")
        start = int(byte_range[0])
        end = int(byte_range[1]) if byte_range[1] else file_size - 1
        end = min(end, file_size - 1)
        chunk_size = end - start + 1

        def generate_chunk():
            with open(filepath, "rb") as f:
                f.seek(start)
                remaining = chunk_size
                while remaining > 0:
                    data = f.read(min(65536, remaining))
                    if not data: break
                    remaining -= len(data)
                    yield data

        headers = {
            "Content-Range": f"bytes {start}-{end}/{file_size}",
            "Accept-Ranges": "bytes",
            "Content-Length": str(chunk_size),
            "Content-Type": "video/webm",
        }
        return Response(generate_chunk(), status=206, headers=headers)

    # Full file
    def generate_full():
        with open(filepath, "rb") as f:
            while True:
                data = f.read(65536)
                if not data: break
                yield data

    headers = {
        "Content-Length": str(file_size),
        "Content-Type": "video/webm",
        "Accept-Ranges": "bytes",
    }
    return Response(generate_full(), status=200, headers=headers)


# ── Video metadata ─────────────────────────────────────────────────────────────
@app.route("/api/video/<video_id>/info")
def video_info(video_id):
    if video_id not in VIDEOS:
        return jsonify({"error": "Video not found or expired"}), 404

    video = VIDEOS[video_id]
    import datetime
    created = datetime.datetime.fromtimestamp(video["created_at"]).isoformat()
    
    # Calculate time remaining
    expires_at = video["created_at"] + (15 * 60)
    ttl = int(expires_at - time.time())

    return jsonify({
        "id": video_id,
        "size": video["size"],
        "created": created,
        "ttl": ttl, # Time to live in seconds
        "protected": True
    })


# ── Delete video ───────────────────────────────────────────────────────────────
@app.route("/video/<video_id>", methods=["DELETE"])
def delete_video(video_id):
    if video_id in VIDEOS:
        data = VIDEOS.pop(video_id)
        if os.path.exists(data['filepath']):
            os.remove(data['filepath'])
        return jsonify({"success": True})
        
    return jsonify({"error": "Video not found"}), 404


if __name__ == "__main__":
    print("🎬 SnapRec Flask backend running at http://localhost:5000")
    print(f"📁 Uploads: {UPLOAD_DIR}")
    app.run(host="0.0.0.0", port=5000, debug=True)
