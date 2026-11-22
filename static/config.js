// Set this to the public URL of the Flask API deployed on Render.
// Example: window.OBJECT_DETECTION_API_URL = 'https://my-api.onrender.com';
const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
window.OBJECT_DETECTION_API_URL = isLocalhost
    ? window.location.origin
    : 'https://object-detection-api.onrender.com';
