from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import pandas as pd
import time

# Initialize the WebDriver (make sure the correct driver is installed)
driver = webdriver.Chrome()

# Step 1: Go to the page with the dropdown
driver.get('URL_of_the_page_with_dropdown')

# Step 2: Select the first dropdown option
dropdown1 = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, 'dropdown1_id')))  # Adjust with the correct dropdown ID
select1 = Select(dropdown1)
select1.select_by_visible_text('Option1')  # Adjust the option you need to select
time.sleep(2)  # Wait for the table to load after selection

# Step 3: Select the second dropdown option
dropdown2 = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, 'dropdown2_id')))  # Adjust with the correct dropdown ID
select2 = Select(dropdown2)
select2.select_by_visible_text('Option2')  # Adjust the option you need to select
time.sleep(2)  # Wait for the table to load after selection

# Step 4: Select the third dropdown option
dropdown3 = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, 'dropdown3_id')))  # Adjust with the correct dropdown ID
select3 = Select(dropdown3)
select3.select_by_visible_text('Option3')  # Adjust the option you need to select
time.sleep(2)  # Wait for the table to load after selection

# Step 5: Select the fourth dropdown option
dropdown4 = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, 'dropdown4_id')))  # Adjust with the correct dropdown ID
select4 = Select(dropdown4)
select4.select_by_visible_text('Option4')  # Adjust the option you need to select
time.sleep(2)  # Wait for the table to load after selection

# Step 6: Select the fifth dropdown option
dropdown5 = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, 'dropdown5_id')))  # Adjust with the correct dropdown ID
select5 = Select(dropdown5)
select5.select_by_visible_text('Option5')  # Adjust the option you need to select
time.sleep(2)  # Wait for the table to load after selection

# Step 7: Scrape the table data
# Wait until the table is loaded
WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'table')))

# Define a list to store all the data
all_data = []

# Scrape data for all pages (if paginated)
while True:
    # Get the table rows (adjust the selector if necessary)
    rows = driver.find_elements(By.CSS_SELECTOR, 'table tbody tr')
    
    # Loop through each row and get the text data
    for row in rows:
        cells = row.find_elements(By.TAG_NAME, 'td')
        data = [cell.text for cell in cells]
        all_data.append(data)
    
    # Check if there is a "Next" button and click it if available (if paginated)
    try:
        next_button = driver.find_element(By.XPATH, '//button[text()="Next"]')  # Adjust XPath if needed
        next_button.click()
        time.sleep(2)  # Wait for the page to load
    except:
        print("No more pages to load.")
        break

# Step 8: Convert the data to a DataFrame
df = pd.DataFrame(all_data)

# Step 9: Save to CSV
df.to_csv('scraped_data.csv', index=False, encoding='utf-8-sig')

# Step 10: Close the driver
driver.quit()

print("Data successfully scraped and saved to 'scraped_data.csv'.")
