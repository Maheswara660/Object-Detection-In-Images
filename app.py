import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from detector import ObjectDetector

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# Initialize detector
detector = ObjectDetector()

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400

    try:
        # Read file into memory
        image_bytes = file.read()
        
        # Get threshold from form data or default
        threshold = float(request.form.get('confidence', 0.25))
        
        # Process image
        results = detector.process_image(image_bytes, threshold)
        
        return jsonify(results)
        
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
