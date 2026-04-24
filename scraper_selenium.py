#!/usr/bin/env python3
"""
Web scraper for GlobalData renewable energy companies using Selenium
Extracts company names from JavaScript-rendered pages
"""

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import csv
import time

def setup_driver():
    """Setup Chrome driver with headless mode"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--ignore-certificate-errors")
    chrome_options.add_argument("--ignore-ssl-errors")
    chrome_options.add_argument("--disable-web-security")
    chrome_options.add_argument("--allow-running-insecure-content")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    try:
        driver = webdriver.Chrome(options=chrome_options)
        return driver
    except Exception as e:
        print(f"Error setting up Chrome driver: {e}")
        print("Trying with chromedriver from /usr/bin/chromedriver...")
        service = Service('/usr/bin/chromedriver')
        driver = webdriver.Chrome(service=service, options=chrome_options)
        return driver

def scrape_page_selenium(page_num, driver):
    """Scrape a single page using Selenium and return list of company names"""
    if page_num == 1:
        url = "https://www.globaldata.com/store/industry/renewables-power-generation-market/?selected_facets%5B0%5D=geography_str%3ANorth%20America&per_page=50"
    else:
        url = f"https://www.globaldata.com/store/industry/renewables-power-generation-market/page/{page_num}/?selected_facets%5B0%5D=geography_str%3ANorth%20America&per_page=50"

    print(f"Scraping page {page_num}: {url}")

    try:
        driver.get(url)

        # Wait for page to load (wait for body or a specific element)
        wait = WebDriverWait(driver, 20)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        # Additional wait for dynamic content to load
        time.sleep(3)

        # Get the page source after JavaScript has rendered
        page_source = driver.page_source

        # Parse with BeautifulSoup
        soup = BeautifulSoup(page_source, 'html.parser')

        companies = []

        # Debug: Save first page HTML to file
        if page_num == 1:
            with open('selenium_page_source.html', 'w', encoding='utf-8') as f:
                f.write(page_source)
            print("  Saved first page HTML to selenium_page_source.html for debugging")

        # Try multiple selectors to find company profiles
        # Look for text containing "Company Profile"
        elements = soup.find_all(string=lambda text: text and 'Company Profile' in str(text))

        if elements:
            print(f"  Found {len(elements)} elements with 'Company Profile'")
            for elem in elements:
                # Get the parent elements to find the company name
                parent = elem.parent
                # Look for nearby headings or links
                if parent:
                    # Try to find h3 or anchor tags nearby
                    heading = parent.find_parent(['h3', 'h2', 'h4', 'div'])
                    if heading:
                        links = heading.find_all('a')
                        for link in links:
                            text = link.get_text(strip=True)
                            if text and 'Company Profile' in text:
                                company_name = text.replace(' - Company Profile', '').replace('Company Profile -', '').strip()
                                if company_name:
                                    companies.append(company_name)
                                    print(f"  Found: {company_name}")
        else:
            print("  No 'Company Profile' text found - trying alternative selectors...")

            # Alternative: Look for all links and filter those containing companies
            all_links = soup.find_all('a', href=True)
            for link in all_links:
                text = link.get_text(strip=True)
                if 'Company Profile' in text:
                    company_name = text.replace(' - Company Profile', '').replace('Company Profile -', '').strip()
                    if company_name:
                        companies.append(company_name)
                        print(f"  Found: {company_name}")

        print(f"Page {page_num}: Found {len(companies)} companies")
        return companies

    except Exception as e:
        print(f"Error scraping page {page_num}: {e}")
        return []

def main():
    """Main function to scrape 50 pages and save results"""
    print("Starting GlobalData renewable energy companies scraper (Selenium)...")
    print("Target: First 50 pages\n")

    driver = setup_driver()

    try:
        all_companies = []

        # Scrape pages 1-50
        for page_num in range(1, 51):
            companies = scrape_page_selenium(page_num, driver)
            all_companies.extend(companies)

            # Be polite - add delay between requests
            if page_num < 50:
                time.sleep(2)

        # Remove duplicates while preserving order
        unique_companies = []
        seen = set()
        for company in all_companies:
            if company not in seen:
                unique_companies.append(company)
                seen.add(company)

        # Save to CSV
        output_file = 'renewable_energy_companies.csv'
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Company Name'])
            for company in unique_companies:
                writer.writerow([company])

        print(f"\n{'='*60}")
        print(f"Scraping completed!")
        print(f"Total companies found: {len(all_companies)}")
        print(f"Unique companies: {len(unique_companies)}")
        print(f"Results saved to: {output_file}")
        print(f"{'='*60}")

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
