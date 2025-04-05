import cv2
import pytesseract

# Set the path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def preprocess_image(image_path):
    img = cv2.imread(image_path)

    if img is None:
        print("❌ Image not found. Check the path!")
        return None

    img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    blur = cv2.GaussianBlur(gray, (3, 3), 0)

    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    return thresh

# Load and preprocess image
image_path = r'C:\Mrinal\TestImages\test.jpg'  # Update if necessary
processed_image = preprocess_image(image_path)

if processed_image is not None:
    # Show image (optional)
    cv2.imshow("Preprocessed Image", processed_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    # Extract text using Tesseract
    text = pytesseract.image_to_string(processed_image, lang='eng')
    print("✅ Extracted Text:\n", text)

    # Save to file
    with open("output.txt", "w", encoding="utf-8") as f:
        f.write(text)
