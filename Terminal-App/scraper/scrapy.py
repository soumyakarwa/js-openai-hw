import requests
import json
from bs4 import BeautifulSoup

def fetch_reviews(url):
    reviews_collected = []
    while len(reviews_collected) < 100:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        reviews = soup.find_all('section', class_='ReviewText')

        for review in reviews:
            review_text = review.text.strip()
            word_count = len(review_text.split())

            if word_count < 200:
                reviews_collected.append(review_text)

            if len(reviews_collected) >= 100:
                break

        next_page_link = soup.find('a', string='More reviews and ratings ›')
        if next_page_link and len(reviews_collected) < 100:
            url = 'https://www.goodreads.com' + next_page_link.get('href')
        else:
            break

    return reviews_collected

start_url = "https://www.goodreads.com/book/show/50892212/reviews?reviewFilters={%22workId%22:%22kca://work/amzn1.gr.work.v1.HOjVmt1CX33_g50JhSG6FA%22,%22after%22:%22Mzg0MDIsMTY2MDEyNDIwMTQ1MA%22}"
reviews = fetch_reviews(start_url)

with open('reviews.json', 'w') as json_file:
    json.dump(reviews, json_file, indent=4)
