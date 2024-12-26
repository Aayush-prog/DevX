import pandas as pd
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

# Ensure you have downloaded the necessary NLTK datasets
import nltk
nltk.download('punkt')
nltk.download('stopwords')

# Define the function to clean text
def clean_text(text):
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Convert to lowercase
    text = text.lower()
    # Tokenize text
    words = word_tokenize(text)
    # Remove stopwords
    filtered_words = [word for word in words if word not in stopwords.words('english')]
    return ' '.join(filtered_words)

# Read the CSV file into a DataFrame
data = pd.read_csv('scrapped_jobs.csv')

# Clean the description
data['Description'] = data['Description'].apply(clean_text)

# Save the cleaned data back to a CSV
data.to_csv('processed_scrapped_jobs.csv', index=False)

print("CSV cleaned and saved as 'processed_scrapped_jobs.csv'")
