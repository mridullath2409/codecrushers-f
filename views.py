import cv2
import threading
import numpy as np
import joblib
import mediapipe as mp
from django.http import StreamingHttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

# Load the ASL model
asl_model = joblib.load("sign_language_model.pkl")

# Initialize MediaPipe Holistic Model
mp_holistic = mp.solutions.holistic
holistic = mp_holistic.Holistic(
    static_image_mode=False,
    model_complexity=1,
    smooth_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Global Variables
cam = None
detected_sign = "Waiting..."
lock = threading.Lock()

def cam_init(w=640, h=480):
    """Start camera with the correct settings."""
    global cam
    if cam is None or not cam.isOpened():
        cam = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        cam.set(cv2.CAP_PROP_FRAME_WIDTH, w)
        cam.set(cv2.CAP_PROP_FRAME_HEIGHT, h)
        cam.set(cv2.CAP_PROP_FPS, 30)  # Reduced to 30 FPS for smoother streaming
        cam.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # Reduce delay

def process_frame(img):
    """Detect and predict ASL sign."""
    global detected_sign
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    res = holistic.process(img_rgb)
    points = []

    if res.left_hand_landmarks:
        points.extend([lm.x for lm in res.left_hand_landmarks.landmark])
        points.extend([lm.y for lm in res.left_hand_landmarks.landmark])
        points.extend([lm.z for lm in res.left_hand_landmarks.landmark])

    if res.right_hand_landmarks:
        points.extend([lm.x for lm in res.right_hand_landmarks.landmark])
        points.extend([lm.y for lm in res.right_hand_landmarks.landmark])
        points.extend([lm.z for lm in res.right_hand_landmarks.landmark])

    detected_sign = asl_model.predict([points])[0] if len(points) == 126 else "Waiting..."
    
    # Resize frame to reduce size (optimization)
    img = cv2.resize(img, (480, 360))  
    return img

def stream_frames():
    """Continuously capture video frames with optimized resolution."""
    global cam
    cam_init()
    
    while cam and cam.isOpened():
        with lock:
            ok, frame = cam.read()
            if not ok:
                break
            
            frame = process_frame(frame)
            
            # Compress frame for faster transmission
            _, buf = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 65])  

        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buf.tobytes() + b'\r\n')

def home(request):
    """Render the homepage."""
    return render(request, "recognition/index.html")

def recognition(request):
    """Render the recognition page and start the camera with adaptive resolution."""
    ua = request.headers.get('User-Agent', '').lower()
    cam_init(360, 270) if "mobi" in ua else cam_init(1280, 720)
    return render(request, "recognition/recognition.html")

def video_feed(request):
    """Return the video stream response."""
    return StreamingHttpResponse(stream_frames(), content_type="multipart/x-mixed-replace; boundary=frame")

def get_sign(request):
    """Return the latest detected sign."""
    return JsonResponse({"sign": detected_sign})

@csrf_exempt
def stop_video(request):
    """Stop the camera feed completely and clear cache."""
    global cam
    if cam:
        with lock:
            cam.release()
            cam = None
            cv2.destroyAllWindows()
    return JsonResponse({}, status=204)
