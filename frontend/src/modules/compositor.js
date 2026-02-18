export class CanvasCompositor {
    constructor(width, height) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d', { alpha: false }); // alpha: false for performance

        // State
        this.strokes = []; // Array of stroke objects { points: [{x,y}], color, size }
        this.currentStroke = null;
        this.isDrawing = false;

        // Video source (the screen share)
        this.video = document.createElement('video');
        this.video.muted = true;
        this.video.playsInline = true;

        this.isActive = false;
    }

    start(stream) {
        this.video.srcObject = stream;
        this.video.play();
        this.isActive = true;
        this.loop();

        // Return the canvas stream (this is what you record!)
        return this.canvas.captureStream(60); // 60 FPS
    }

    stop() {
        this.isActive = false;
        this.video.srcObject = null;
        // clear strokes?
    }

    // The Render Loop (60fps)
    loop = () => {
        if (!this.isActive) return;

        // 1. Clear Canvas
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Not needed if drawing video over entire canvas

        // 2. Draw Screen Video Frame
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        }

        // 3. Draw All Strokes on top
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Draw completed strokes
        this.strokes.forEach(stroke => {
            this.ctx.beginPath();
            this.ctx.strokeStyle = stroke.color;
            this.ctx.lineWidth = stroke.size;
            if (stroke.points.length > 0) {
                this.ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
                for (let i = 1; i < stroke.points.length; i++) {
                    this.ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
                }
            }
            this.ctx.stroke();
        });

        // Draw current stroke (being drawn right now)
        if (this.currentStroke) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.currentStroke.color;
            this.ctx.lineWidth = this.currentStroke.size;
            if (this.currentStroke.points.length > 0) {
                this.ctx.moveTo(this.currentStroke.points[0].x, this.currentStroke.points[0].y);
                for (let i = 1; i < this.currentStroke.points.length; i++) {
                    this.ctx.lineTo(this.currentStroke.points[i].x, this.currentStroke.points[i].y);
                }
            }
            this.ctx.stroke();
        }

        requestAnimationFrame(this.loop);
    }

    // Input Handling (Connect these to your UI's mouse/touch events)
    startStroke(x, y, color = 'red', size = 4) {
        this.isDrawing = true;
        this.currentStroke = { points: [{ x, y }], color, size };
    }

    moveStroke(x, y) {
        if (!this.isDrawing) return;
        this.currentStroke.points.push({ x, y });
    }

    endStroke() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        if (this.currentStroke) {
            this.strokes.push(this.currentStroke);
        }
        this.currentStroke = null;
    }

    clear() {
        this.strokes = [];
    }
}