import os
import uuid
from flask import Flask, request, jsonify, Response, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_UPLOAD_SIZE = 2 * 1024 * 1024 * 1024  # 2 GB


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

    share_url = f"http://localhost:5173/view/{video_id}"

    print(f"[upload] {video_id} — {size / 1024 / 1024:.2f} MB")
    return jsonify({"id": video_id, "shareUrl": share_url, "size": size})


# ── Stream video (with Range support) ────────────────────────────────────────
@app.route("/video/<video_id>")
def stream_video(video_id):
    # Sanitize: only allow UUID-like names
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
                    if not data:
                        break
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
                if not data:
                    break
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
    safe_id = "".join(c for c in video_id if c.isalnum() or c == "-")
    filepath = os.path.join(UPLOAD_DIR, f"{safe_id}.webm")

    if not os.path.isfile(filepath):
        return jsonify({"error": "Video not found"}), 404

    stat = os.stat(filepath)
    import datetime
    created = datetime.datetime.fromtimestamp(stat.st_ctime).isoformat()

    return jsonify({
        "id": safe_id,
        "size": stat.st_size,
        "created": created,
        "shareUrl": f"http://localhost:5173/view/{safe_id}",
    })


# ── Delete video ───────────────────────────────────────────────────────────────
@app.route("/video/<video_id>", methods=["DELETE"])
def delete_video(video_id):
    safe_id = "".join(c for c in video_id if c.isalnum() or c == "-")
    filepath = os.path.join(UPLOAD_DIR, f"{safe_id}.webm")

    if not os.path.isfile(filepath):
        return jsonify({"error": "Video not found"}), 404

    os.remove(filepath)
    return jsonify({"success": True})


if __name__ == "__main__":
    print("🎬 SnapRec Flask backend running at http://localhost:5000")
    print(f"📁 Uploads: {UPLOAD_DIR}")
    app.run(host="0.0.0.0", port=5000, debug=True)
