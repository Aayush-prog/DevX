from PIL import Image
import pytesseract
import os

def extract_text_from_image(image_filename):
    try:
        image_path = os.path.join(os.getcwd(), image_filename)
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        return text
    except FileNotFoundError:
        print(f"File not found: {image_filename}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")


image_filename = "cv.png"  
text = extract_text_from_image(image_filename)
print(text)