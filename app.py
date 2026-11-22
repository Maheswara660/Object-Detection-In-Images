import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from detector import ObjectDetector

app = Flask(__name__, static_folder='static', static_url_path='')
allowed_origin = os.getenv('ALLOWED_ORIGIN', '*')
CORS(app, resources={r"/*": {"origins": allowed_origin}})
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

# Initialize detector
detector = ObjectDetector()

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})

@app.errorhandler(413)
def request_too_large(_error):
    return jsonify({'error': 'The uploaded image is larger than 10 MB'}), 413

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400
    if not file.mimetype.startswith('image/'):
        return jsonify({'error': 'The uploaded file is not an image'}), 400

    try:
        # Read file into memory
        image_bytes = file.read()
        if not image_bytes:
            return jsonify({'error': 'The uploaded image is empty'}), 400

        # Get threshold from form data or default
        try:
            threshold = float(request.form.get('confidence', 0.25))
        except (TypeError, ValueError):
            return jsonify({'error': 'Invalid confidence threshold'}), 400
        if threshold < 0 or threshold > 1:
            return jsonify({'error': 'Confidence threshold must be between 0 and 1'}), 400

        # Process image
        results = detector.process_image(image_bytes, threshold)

        return jsonify(results)

    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': 'Could not process the uploaded image'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
