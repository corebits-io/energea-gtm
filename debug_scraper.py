#!/usr/bin/env python3
"""
Debug script to inspect the actual HTML structure
"""

import requests
from bs4 import BeautifulSoup

url = "https://www.globaldata.com/store/industry/renewables-power-generation-market/?selected_facets%5B0%5D=geography_str%3ANorth%20America&per_page=50"

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
})

print("Fetching URL...")
response = session.get(url, timeout=30)
print(f"Status code: {response.status_code}")

# Save the HTML to a file
with open('page_source.html', 'w', encoding='utf-8', errors='replace') as f:
    f.write(response.text)

print("HTML saved to page_source.html")

# Parse with BeautifulSoup
soup = BeautifulSoup(response.content, 'html.parser')

# Look for different possible structures
print("\n" + "="*60)
print("Looking for report items...")
print("="*60)

# Try to find div with class containing 'report'
divs_with_report = soup.find_all('div', class_=lambda x: x and 'report' in x.lower() if x else False)
print(f"\nFound {len(divs_with_report)} divs with 'report' in class name")
for i, div in enumerate(divs_with_report[:3]):
    print(f"\nDiv {i+1} classes: {div.get('class')}")

# Try to find anything with "Company Profile" text
print("\n" + "="*60)
print("Looking for 'Company Profile' text...")
print("="*60)
elements_with_company_profile = soup.find_all(string=lambda text: text and 'Company Profile' in text)
print(f"Found {len(elements_with_company_profile)} elements containing 'Company Profile'")
for i, elem in enumerate(elements_with_company_profile[:5]):
    print(f"\nElement {i+1}:")
    print(f"Text: {elem.strip()}")
    print(f"Parent tag: {elem.parent.name if elem.parent else 'None'}")
    print(f"Parent classes: {elem.parent.get('class') if elem.parent else 'None'}")

# Look for h3 or h4 tags
print("\n" + "="*60)
print("Looking for h3 and h4 tags...")
print("="*60)
h3_tags = soup.find_all('h3')
h4_tags = soup.find_all('h4')
print(f"Found {len(h3_tags)} h3 tags")
print(f"Found {len(h4_tags)} h4 tags")

if h4_tags:
    print("\nFirst 3 h4 tags:")
    for i, h4 in enumerate(h4_tags[:3]):
        print(f"{i+1}. {h4.get_text(strip=True)}")

if h3_tags:
    print("\nFirst 3 h3 tags:")
    for i, h3 in enumerate(h3_tags[:3]):
        print(f"{i+1}. {h3.get_text(strip=True)}")
