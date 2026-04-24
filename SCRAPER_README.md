# GlobalData Renewable Energy Companies Scraper

## Overview
This scraper extracts renewable energy company names from the GlobalData website for North America.

## Important Notes

### Challenges Encountered
1. **JavaScript-Rendered Content**: The GlobalData website loads content dynamically using JavaScript, requiring a browser automation tool like Selenium
2. **Potential Anti-Scraping Measures**: The website may have protection against automated scraping
3. **Subscription Requirements**: Full access to company profiles might require a GlobalData subscription
4. **Environment Restrictions**: Some cloud/container environments may have network restrictions

## Installation & Usage

### Prerequisites
- Python 3.7 or higher
- Chrome or Chromium browser installed

### Setup

1. **Install required packages:**
```bash
pip install selenium webdriver-manager beautifulsoup4
```

2. **Run the scraper:**
```bash
python globaldata_scraper_local.py
```

3. **Follow the prompts** to specify how many pages to scrape (default: 50)

## Output

The scraper creates a CSV file named `renewable_energy_companies.csv` with the following format:

```csv
Company Name
Tesla Inc.
First Solar Inc.
...
```

## Troubleshooting

### If the scraper finds 0 companies:

1. **Check if the website requires login:**
   - The GlobalData website may require authentication
   - You might need to add cookies or session handling

2. **Inspect the HTML structure:**
   - The scraper saves `debug_page_1.html` for inspection
   - Check if the page structure matches the scraper's selectors

3. **Try running without headless mode:**
   - Comment out the `--headless` line in `setup_driver()` to see what the browser sees
   - This helps diagnose if content is loading properly

4. **Check for CAPTCHA or bot detection:**
   - Some websites show CAPTCHAs to automated browsers
   - You may need to add delays or use more sophisticated anti-detection measures

### Alternative Approaches

If web scraping doesn't work:

1. **API Access**: Check if GlobalData offers an API for their data
2. **Data Purchase**: Consider purchasing the data directly from GlobalData
3. **Alternative Data Sources**: Look for renewable energy company lists from:
   - Department of Energy databases
   - Industry associations (Solar Energy Industries Association, American Wind Energy Association)
   - Public databases like Crunchbase, PitchBook
   - SEC EDGAR filings

## Ethical Considerations

- Always respect `robots.txt`
- Add appropriate delays between requests
- Don't overwhelm the server
- Check the website's Terms of Service
- Consider contacting GlobalData for legitimate data access

## Files Created

- `renewable_energy_companies.csv` - Final output with company names
- `debug_page_1.html` - First page HTML for debugging (if no companies found)
- `globaldata_scraper_local.py` - The main scraper script

## Customization

### To scrape a different region:
Change the `selected_facets` parameter in the URL:
```python
# Example for Europe instead of North America
url = "https://www.globaldata.com/store/industry/renewables-power-generation-market/?selected_facets%5B0%5D=geography_str%3AEurope&per_page=50"
```

### To adjust wait times:
Modify the `time.sleep()` values if pages load slowly or too quickly.

### To change the number of items per page:
Modify the `per_page=50` parameter in the URL (if supported).

## Legal Disclaimer

This scraper is provided for educational purposes. Ensure you have permission to scrape the target website and comply with:
- The website's Terms of Service
- robots.txt directives
- Applicable data protection laws (GDPR, CCPA, etc.)
- Copyright and intellectual property rights

The user is solely responsible for how they use this tool.
