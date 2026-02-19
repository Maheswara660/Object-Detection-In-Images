from ultralytics import YOLO
import cv2
import numpy as np
from PIL import Image

class ObjectDetector:
    def __init__(self, model_path='yolov8m.pt'):
        """
        Initialize the YOLOv8 model.
        Uses the nano model by default for speed.
        """
        self.model = YOLO(model_path)

    def process_image(self, image_bytes, confidence_threshold=0.25):
        """
        Process an image and return detection results.
        
        Args:
            image_bytes: Image data in bytes
            confidence_threshold: Minimum confidence score to include a detection
            
        Returns:
            dict: Detection results containing boxes, labels, and original image size
        """
        # Convert bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Could not decode image")

        # Run inference
        results = self.model(img, conf=confidence_threshold)
        
        detections = []
        result = results[0]  # We only process one image at a time
        
        # Get class names dictionary
        names = result.names
        
        for box in result.boxes:
            # Get box coordinates (xyxy format)
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            
            # Get confidence and class id
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            label = names[cls_id]
            
            detections.append({
                'bbox': [x1, y1, x2, y2],
                'confidence': conf,
                'label': label,
                'class_id': cls_id
            })
            
        return {
            'detections': detections,
            'image_size': {'width': img.shape[1], 'height': img.shape[0]}
        }
