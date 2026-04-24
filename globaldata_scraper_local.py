#!/usr/bin/env python3
"""
Web scraper for GlobalData renewable energy companies
Run this on your local machine with Python 3.7+

Requirements:
    pip install selenium webdriver-manager beautifulsoup4

Usage:
    python globaldata_scraper_local.py
"""

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import csv
import time
import sys

def setup_driver():
    """Setup Chrome driver with headless mode"""
    print("Setting up Chrome driver...")
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Comment this out to see the browser
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

    # Automatically download and manage ChromeDriver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def scrape_page(page_num, driver):
    """Scrape a single page and return list of company names"""
    if page_num == 1:
        url = "https://www.globaldata.com/store/industry/renewables-power-generation-market/?selected_facets%5B0%5D=geography_str%3ANorth%20America&per_page=50"
    else:
        url = f"https://www.globaldata.com/store/industry/renewables-power-generation-market/page/{page_num}/?selected_facets%5B0%5D=geography_str%3ANorth%20America&per_page=50"

    print(f"\nScraping page {page_num}...")
    sys.stdout.flush()

    try:
        driver.get(url)

        # Wait for page to load
        wait = WebDriverWait(driver, 30)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        # Wait for dynamic content
        time.sleep(3)

        # Get page source
        page_source = driver.page_source

        # Parse with BeautifulSoup
        soup = BeautifulSoup(page_source, 'html.parser')

        companies = []

        # Method 1: Look for text containing "Company Profile"
        company_profile_elements = soup.find_all(string=lambda text: text and 'Company Profile' in str(text))

        for elem in company_profile_elements:
            parent = elem.parent
            # Navigate up to find the container with company name
            for _ in range(5):  # Check up to 5 parent levels
                if parent:
                    # Look for links or headings
                    link = parent.find('a')
                    if link:
                        full_text = link.get_text(strip=True)
                        if 'Company Profile' in full_text:
                            # Clean company name
                            company_name = full_text.replace(' - Company Profile', '').replace('Company Profile -', '').replace('Company Profile', '').strip()
                            if company_name and company_name not in companies and len(company_name) > 2:
                                companies.append(company_name)
                                print(f"  ✓ Found: {company_name}")
                                break
                    parent = parent.parent
                else:
                    break

        # Method 2: Direct search for company profile links
        all_links = soup.find_all('a', href=True)
        for link in all_links:
            text = link.get_text(strip=True)
            if 'Company Profile' in text and 'View all' not in text:
                company_name = text.replace(' - Company Profile', '').replace('Company Profile -', '').replace('Company Profile', '').strip()
                if company_name and company_name not in companies and len(company_name) > 2:
                    companies.append(company_name)
                    print(f"  ✓ Found: {company_name}")

        if not companies:
            print(f"  ⚠ No companies found on page {page_num}")
            # Save page source for debugging
            if page_num == 1:
                with open(f'debug_page_{page_num}.html', 'w', encoding='utf-8') as f:
                    f.write(page_source)
                print(f"  Saved page source to debug_page_{page_num}.html for inspection")

        return companies

    except Exception as e:
        print(f"  ✗ Error scraping page {page_num}: {e}")
        return []

def main():
    """Main function"""
    print("="*70)
    print("GlobalData Renewable Energy Companies Scraper")
    print("="*70)

    # Get number of pages to scrape
    try:
        num_pages = int(input("\nHow many pages to scrape? (default: 50): ").strip() or "50")
    except ValueError:
        num_pages = 50

    print(f"\nWill scrape {num_pages} pages...")
    print("This may take a while (approx 2-3 seconds per page)")
    print("-"*70)

    driver = setup_driver()

    try:
        all_companies = []
        successful_pages = 0

        for page_num in range(1, num_pages + 1):
            companies = scrape_page(page_num, driver)
            if companies:
                all_companies.extend(companies)
                successful_pages += 1

            # Be polite - delay between requests
            if page_num < num_pages:
                time.sleep(2)

        print("\n" + "="*70)
        print("Scraping Complete!")
        print("="*70)

        # Remove duplicates while preserving order
        unique_companies = []
        seen = set()
        for company in all_companies:
            if company.lower() not in seen:  # Case-insensitive deduplication
                unique_companies.append(company)
                seen.add(company.lower())

        # Save to CSV
        output_file = 'renewable_energy_companies.csv'
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Company Name'])
            for company in unique_companies:
                writer.writerow([company])

        print(f"\nResults:")
        print(f"  • Pages scraped successfully: {successful_pages}/{num_pages}")
        print(f"  • Total companies found: {len(all_companies)}")
        print(f"  • Unique companies: {len(unique_companies)}")
        print(f"  • Output saved to: {output_file}")
        print("\nFirst 10 companies:")
        for i, company in enumerate(unique_companies[:10], 1):
            print(f"  {i}. {company}")

        if len(unique_companies) > 10:
            print(f"  ... and {len(unique_companies) - 10} more")

    finally:
        print("\nClosing browser...")
        driver.quit()
        print("Done!")

if __name__ == "__main__":
    main()
