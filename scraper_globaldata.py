#!/usr/bin/env python3
"""
Web scraper for GlobalData renewable energy companies
Extracts company names from company profile listings
"""

import requests
from bs4 import BeautifulSoup
import csv
import time
from urllib.parse import urljoin

def scrape_page(page_num, session):
    """Scrape a single page and return list of company names"""
    if page_num == 1:
        url = "https://www.globaldata.com/store/industry/renewables-power-generation-market/?selected_facets%5B0%5D=geography_str%3ANorth%20America&per_page=50"
    else:
        url = f"https://www.globaldata.com/store/industry/renewables-power-generation-market/page/{page_num}/?selected_facets%5B0%5D=geography_str%3ANorth%20America&per_page=50"

    print(f"Scraping page {page_num}: {url}")

    try:
        response = session.get(url, timeout=30)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        companies = []

        # Find all report items
        report_items = soup.find_all('div', class_='report-item')

        for item in report_items:
            # Check if this is a Company Profile
            report_type = item.find('h4', class_='report-type')
            if report_type and 'Company Profile' in report_type.get_text():
                # Extract company name from h3 > a tag
                title_tag = item.find('h3')
                if title_tag:
                    link = title_tag.find('a')
                    if link:
                        full_title = link.get_text(strip=True)
                        # Remove " - Company Profile" suffix if present
                        company_name = full_title.replace(' - Company Profile', '').strip()
                        companies.append(company_name)
                        print(f"  Found: {company_name}")

        print(f"Page {page_num}: Found {len(companies)} companies")
        return companies

    except requests.exceptions.RequestException as e:
        print(f"Error scraping page {page_num}: {e}")
        return []

def main():
    """Main function to scrape 50 pages and save results"""
    print("Starting GlobalData renewable energy companies scraper...")
    print("Target: First 50 pages\n")

    all_companies = []

    # Create a session for better performance
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })

    # Scrape pages 1-50
    for page_num in range(1, 51):
        companies = scrape_page(page_num, session)
        all_companies.extend(companies)

        # Be polite - add delay between requests
        if page_num < 50:
            time.sleep(2)  # 2 second delay between pages

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

if __name__ == "__main__":
    main()
