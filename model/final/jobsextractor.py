import requests
import csv
import os
from dotenv import load_dotenv
load_dotenv()
# Replace with your Adzuna credentials
# APP_ID = os.getenv("ADZUNA_APPID")
# APP_KEY = os.getenv("ADZUNA_API")
BASE_URL = "https://api.adzuna.com/v1/api/jobs"

# Job roles and location
job_roles = [
    "Data Scientist", "Database Engineer", "Designer", "DevOps Engineer", "DotNet Developer",
    "Information Technology", "Java Developer", "Network Security Engineer", "Python Developer",
    "QA", "React Developer", "SAP Developer", "SQL Developer"
]
LOCATION = "us"

# Function to fetch jobs
def fetch_jobs():
    all_jobs = []

    for role in job_roles:
        params = {
            "app_id": "36b552a1",
            "app_key": "7d3553c06df9367bdf619735a792339f",
            "results_per_page": 500,
            "what": role,
            "content-type":"application/json"
        }

        response = requests.get(f"{BASE_URL}/gb/search/1", params=params)
        if response.status_code != 200:
            print(f"Failed to fetch jobs for {role}. HTTP Status: {response.status_code}")
            continue

        data = response.json()
        for job in data.get("results", []):
            all_jobs.append({
                "Role": role,
                "Title": job.get("title", "No Title"),
                "Description": job.get("description", "No Description")
            })

    return all_jobs

# Save to CSV
def save_to_csv(jobs, filename="scrapped_jobs.csv"):
    with open(filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=["Role", "Title", "Description"])
        writer.writeheader()
        writer.writerows(jobs)

# Main execution
if __name__ == "__main__":
    print("Fetching jobs from Adzuna...")
    jobs = fetch_jobs()

    if jobs:
        print(f"Found {len(jobs)} jobs. Saving to CSV...")
        save_to_csv(jobs)
        print("Jobs saved to 'adzuna_jobs.csv'.")
    else:
        print("No jobs found.")
