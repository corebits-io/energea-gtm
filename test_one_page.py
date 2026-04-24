#!/usr/bin/env python3
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--ignore-certificate-errors")
chrome_options.add_argument("--ignore-ssl-errors")
chrome_options.add_argument("--disable-web-security")
chrome_options.add_argument("--allow-running-insecure-content")
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

driver = webdriver.Chrome(options=chrome_options)

url = "https://www.globaldata.com/store/industry/renewables-power-generation-market/?selected_facets%5B0%5D=geography_str%3ANorth%20America&per_page=50"
print(f"Loading: {url}")

driver.get(url)
wait = WebDriverWait(driver, 20)
wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
time.sleep(5)  # Extra time for JS to load

page_source = driver.page_source

# Save to file
with open('test_page.html', 'w', encoding='utf-8') as f:
    f.write(page_source)

print(f"Page title: {driver.title}")
print(f"Page source length: {len(page_source)} characters")
print("Saved to test_page.html")

# Check if "Company Profile" appears
if 'Company Profile' in page_source:
    print("✓ Found 'Company Profile' in page!")
    count = page_source.count('Company Profile')
    print(f"  Appears {count} times")
else:
    print("✗ 'Company Profile' NOT found in page")

# Check for common error indicators
if 'Privacy error' in page_source:
    print("✗ Privacy/SSL error detected")
elif 'Access Denied' in page_source or 'Forbidden' in page_source:
    print("✗ Access denied/blocked")
else:
    print("✓ No obvious errors detected")

driver.quit()
