# Object Detection In Images

A powerful object detection application capable of identifying objects in uploaded images using the YOLOv8 model. This project features a Flask backend and a user-friendly frontend interface.

---

## 🚀 Technologies Used

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![YOLOv8](https://img.shields.io/badge/YOLOv8-00FFFF?style=for-the-badge&logo=yolo&logoColor=black)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 📂 Project Structure

```
Object Detection In Images/
├── static/
│   ├── index.html      # Frontend interface
│   ├── script.js       # Frontend logic
│   └── style.css       # Styling
├── templates/          # Flask templates
├── uploads/            # Directory for uploaded images
├── app.py              # Flask application entry point
├── detector.py         # Object detection logic using YOLO
├── requirements.txt    # Project dependencies
├── yolov8n.pt          # YOLOv8 nano model weights
├── yolov8m.pt          # YOLOv8 medium model weights
├── .gitignore
└── README.md
```


---

## 🛠️ Installation & Setup

### Prerequisites

- [Python](https://www.python.org/downloads/) - for compiling the code
- [Git](https://git-scm.com/downloads) - for downloading this project
- [Git LFS](https://git-lfs.com) - Enable Git LFS for downloading YOLOv8 models

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Maheswara660/Object-Detection-In-Images.git
    cd Object-Detection-In-Images
    git lfs install
    git lfs pull
    ```

2.  **Set up the Virtual Environment:**

    Navigate to the project root and create a virtual environment.

    *   **macOS/Linux:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```

    *   **Windows (Command Prompt):**
        ```cmd
        python -m venv venv
        venv\Scripts\activate.bat
        ```

    *   **Windows (PowerShell):**
        ```powershell
        python -m venv venv
        venv\Scripts\Activate.ps1
        ```

3.  **Install Dependencies:**
    Install the required packages from `requirements.txt`.
    ```bash
    pip install -r requirements.txt
    ```

---

## ▶️ Usage & Execution

### Running the Application

Ensure your virtual environment is activated and you are in the project root directory.

```bash
# Set Flask app environment variable (optional but recommended)
export FLASK_APP=app.py
export FLASK_ENV=development

# Run the application
flask run
```
Or simply run:
```bash
python app.py
```

The application will start at `http://127.0.0.1:5000/`.

### Using the Interface

1.  Open your web browser and navigate to `http://localhost:5000`.
2.  Upload an image using the upload button.
3.  Adjust the confidence threshold if needed.
4.  View the detected objects and their bounding boxes on the processed image.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
