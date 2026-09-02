import csv
import re
import time
import unicodedata
from pathlib import Path

import requests
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "STATS401-Class-Exercise/1.0"}
RATING = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}
OUT = Path(__file__).resolve().parent.parent / "data" / "lab3_data.csv"


def clean_title(title):
    title = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode("ascii")
    title = title.upper()
    letters = re.sub(r"[^A-Z ]", " ", title)
    letters = re.sub(r" +", " ", letters).strip()
    return letters or "UNTITLED"

records = []

for page in range(1, 51):
    url = f"https://books.toscrape.com/catalogue/page-{page}.html"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.encoding = "utf-8"
        response.raise_for_status()
    except requests.RequestException as error:
        print(f"Failed on page {page}: {error}")
        continue

    soup = BeautifulSoup(response.text, "html.parser")
    for book in soup.select("article.product_pod"):
        price_text = book.select_one(".price_color").get_text(strip=True)
        rating_word = book.select_one("p.star-rating")["class"][1]
        records.append({
            "title": clean_title(book.select_one("h3 a")["title"]),
            "price": float(price_text.replace("£", "")),
            "rating": RATING[rating_word],
            "availability": book.select_one(".availability").get_text(strip=True),
            "page": page,
        })

    print(f"Page {page}: {len(records)} records", flush=True)
    time.sleep(1)

OUT.parent.mkdir(parents=True, exist_ok=True)
fields = ["title", "price", "rating", "availability", "page"]
with OUT.open("w", newline="", encoding="utf-8") as handle:
    writer = csv.DictWriter(handle, fieldnames=fields)
    writer.writeheader()
    writer.writerows(records)
print(f"Wrote {len(records)} records to {OUT}")
