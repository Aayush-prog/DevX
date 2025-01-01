import requests
import csv
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Replace with your RapidAPI credentials
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST = "upwork17.p.rapidapi.com"
BASE_URL = "https://upwork17.p.rapidapi.com/search"

# Job roles to search
job_roles = [
    "Data Scientist", "Database Engineer", "Designer", "DevOps Engineer", "DotNet Developer",
    "Information Technology", "Java Developer", "Network Security Engineer", "Python Developer",
    "QA", "React Developer", "SAP Developer", "SQL Developer"
]

# Function to fetch jobs from Upwork API
def fetch_jobs():
    all_jobs = []

    headers = {
        "x-rapidapi-key": "e6059036b2msh5ca979f4c2f6914p10d240jsn408b9330ce2a",
        "x-rapidapi-host": RAPIDAPI_HOST
    }

    for role in job_roles:
        querystring = {
            "query": role,
            "page": "1",
            "perPage": "100",  # Adjust as needed; maximum might vary by API limits
            "sort": "relevance",
            "hoursPerWeek": "as_needed",
            "projectLength": "week",
            "contractToHire": "yes"
        }

        response = requests.get(BASE_URL, headers=headers, params=querystring)
        if response.status_code != 200:
            print(f"Failed to fetch jobs for {role}. HTTP Status: {response.status_code}")
            continue

        data = response.json()
        if isinstance(data, list):  # Response is a list of job objects
            for job in data:
                all_jobs.append({
                    "Role": role,
                    "Description": job.get("description", "No Description")
                })
        else:
            print(f"Unexpected data structure for {role}: {type(data)}")

    return all_jobs

# Save to CSV in append mode
def save_to_csv(jobs, filename="scrapped_jobs.csv"):
    file_exists = os.path.isfile(filename)
    with open(filename, mode="a", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=["Role", "Description" ])
        if not file_exists:
            writer.writeheader()  # Write header only if file does not exist
        writer.writerows(jobs)

# Main execution
if __name__ == "__main__":
    print("Fetching jobs from Upwork via RapidAPI...")
    jobs = fetch_jobs()

    if jobs:
        print(f"Found {len(jobs)} jobs. Saving to CSV...")
        save_to_csv(jobs)
        print(f"Jobs appended to 'scraped_jobs.csv'.")
    else:
        print("No jobs found.")
