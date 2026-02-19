document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadSection = document.getElementById('uploadSection');
    const workspaceSection = document.getElementById('workspaceSection');
    const backBtn = document.getElementById('backBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const confidenceRange = document.getElementById('confidenceRange');
    const confidenceValue = document.getElementById('confidenceValue');
    const sourceImage = document.getElementById('sourceImage');
    const outputCanvas = document.getElementById('outputCanvas');
    const loader = document.getElementById('loader');
    const objCount = document.getElementById('objCount');
    const processTime = document.getElementById('processTime');

    // State
    let currentDetections = [];
    let imageScale = 1;

    // Colors for different classes (hash or fixed palette)
    const getLabelColor = (label) => {
        let hash = 0;
        for (let i = 0; i < label.length; i++) {
            hash = label.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h = Math.abs(hash) % 360;
        return `hsl(${h}, 70%, 50%)`; // Distinct bright colors
    };

    // Event Listeners
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    backBtn.addEventListener('click', () => {
        uploadSection.classList.remove('hidden');
        workspaceSection.classList.add('hidden');
        fileInput.value = ''; // Reset input
        currentDetections = [];
        const ctx = outputCanvas.getContext('2d');
        ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    });

    confidenceRange.addEventListener('input', (e) => {
        confidenceValue.textContent = `${e.target.value}%`;
        drawDetections(currentDetections, e.target.value / 100);
    });

    downloadBtn.addEventListener('click', downloadResult);

    // Main Logic
    function handleFile(file) {
        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }

        // Show workspace
        uploadSection.classList.add('hidden');
        workspaceSection.classList.remove('hidden');
        loader.classList.remove('hidden');

        // Load image for preview
        const reader = new FileReader();
        reader.onload = (e) => {
            sourceImage.src = e.target.result;
            sourceImage.onload = () => {
                // Initialize canvas to match image size (display size updated via CSS)
                resizeCanvas();
                // Send to backend
                detectObjects(file);
            };
        };
        reader.readAsDataURL(file);
    }

    async function detectObjects(file) {
        const formData = new FormData();
        formData.append('image', file);
        // Initial detection with low threshold to get all potential candidates
        formData.append('confidence', '0.1');

        const startTime = performance.now();

        try {
            const response = await fetch('/detect', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Detection failed');

            const data = await response.json();
            const endTime = performance.now();

            processTime.textContent = `${(endTime - startTime).toFixed(0)}ms`;
            currentDetections = data.detections;

            // Draw with current slider value
            drawDetections(currentDetections, confidenceRange.value / 100);

        } catch (error) {
            console.error(error);
            alert('Error processing image');
        } finally {
            loader.classList.add('hidden');
        }
    }

    function resizeCanvas() {
        // We set the internal canvas resolution to match the image resolution
        outputCanvas.width = sourceImage.naturalWidth;
        outputCanvas.height = sourceImage.naturalHeight;

        // CSS will handle the visual scaling to fit the container
    }

    function drawDetections(detections, threshold) {
        const ctx = outputCanvas.getContext('2d');

        // Clear previous drawings
        ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

        // Filter by threshold
        const visibleDetections = detections.filter(d => d.confidence >= threshold);
        objCount.textContent = visibleDetections.length;

        visibleDetections.forEach(det => {
            const [x1, y1, x2, y2] = det.bbox;
            const width = x2 - x1;
            const height = y2 - y1;
            const color = getLabelColor(det.label);

            // Draw Box
            ctx.strokeStyle = color;
            ctx.lineWidth = 4; // Thicker lines for better visibility
            ctx.shadowColor = "black";
            ctx.shadowBlur = 4;
            ctx.strokeRect(x1, y1, width, height);
            ctx.shadowBlur = 0; // Reset shadow

            // Draw Label Background
            ctx.fillStyle = color;
            const fontSize = Math.max(14, Math.min(24, width / 5)); // Responsive font size
            ctx.font = `bold ${fontSize}px sans-serif`;
            const text = `${det.label} ${Math.round(det.confidence * 100)}%`;
            const textMetrics = ctx.measureText(text);
            const padding = 4;

            // Draw background for text (burned effect)
            ctx.fillRect(x1, y1 - fontSize - padding * 2, textMetrics.width + padding * 2, fontSize + padding * 2);

            // Draw Text
            ctx.fillStyle = '#ffffff';
            ctx.fillText(text, x1 + padding, y1 - padding);
        });
    }

    function downloadResult() {
        // Create a temporary canvas to merge image and boxes
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sourceImage.naturalWidth;
        tempCanvas.height = sourceImage.naturalHeight;
        const tempCtx = tempCanvas.getContext('2d');

        // Draw original image
        tempCtx.drawImage(sourceImage, 0, 0);

        // Draw current canvas content (boxes) on top
        tempCtx.drawImage(outputCanvas, 0, 0);

        // Download
        const link = document.createElement('a');
        link.download = 'detected_image.png';
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    }

    window.addEventListener('resize', () => {
        // Optional: specific resize logic if needed, 
        // but simple CSS object-fit usually handles this well.
    });
});
