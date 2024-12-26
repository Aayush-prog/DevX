import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Google Custom Search API Configuration from .env
API_KEY = os.getenv("API_KEY")  
CX = os.getenv("CX")  
QUERY = "node js developer resume filetype:pdf " 

# Custom download directory from .env
DOWNLOAD_DIR = os.getenv("DOWNLOAD_DIR") 

def google_search(query, api_key, cx, num_results=10):
    """Search Google using the Custom Search JSON API."""
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "q": query,
        "key": api_key,
        "cx": cx,
        "num": num_results,
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def rename_file_if_exists(filepath):
    """Check if a file exists and rename it by appending a number if necessary."""
    base, ext = os.path.splitext(filepath)
    counter = 1
    new_filepath = filepath
    while os.path.exists(new_filepath):
        new_filepath = f"{base}_{counter}{ext}"
        counter += 1
    return new_filepath

def download_pdf(url, folder):
    """Download a single PDF file and rename it if necessary."""
    try:
        response = requests.get(url, stream=True, timeout=10)
        if response.status_code == 200 and "application/pdf" in response.headers.get("Content-Type", ""):
            # Extract filename from URL
            filename = os.path.join(folder, url.split("/")[-1].split("?")[0])
            
            # Rename file if it already exists
            filename = rename_file_if_exists(filename)
            
            # Save the PDF
            with open(filename, "wb") as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)
            print(f"Downloaded: {filename}")
        else:
            print(f"Skipped (not a PDF): {url}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")

def main():
    """Main function to search and download PDFs."""
    try:
        results = google_search(QUERY, API_KEY, CX, num_results=10)
        items = results.get("items", [])
        for item in items:
            pdf_url = item.get("link")
            if pdf_url and pdf_url.endswith(".pdf"):
                download_pdf(pdf_url, DOWNLOAD_DIR)
    except Exception as e:
        print(f"Error during search or download: {e}")

if __name__ == "__main__":
    main()
