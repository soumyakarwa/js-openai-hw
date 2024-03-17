import requests
from bs4 import BeautifulSoup
import pandas as pd

def fetch_reviews(url, max_reviews=100):
    reviews_collected = []
    while len(reviews_collected) < max_reviews:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        reviews = soup.find_all('section', class_='ReviewText')  # Adjust based on actual HTML structure
        
        for review in reviews:
            review_text = review.text.strip()
            review_data = {'review_text': review_text}
            reviews_collected.append(review_data)
            
            if len(reviews_collected) >= max_reviews:
                break

    return reviews_collected

# Define the starting URL
start_url = "https://www.goodreads.com/book/show/58468990/reviews?reviewFilters={%22workId%22:%22kca://work/amzn1.gr.work.v3.rjR1tgNGsn1cH6aU%22,%22after%22:%22MzM4MjEsMTY0OTAwODcwMjUxNg%22}"

# Fetch the reviews
reviews = fetch_reviews(start_url)

reviews_df = pd.DataFrame(reviews)

# Replace newline characters with spaces in the 'review_text' column
reviews_df['review_text'] = reviews_df['review_text'].str.replace('\n', ' ', regex=False)

# Now, save the DataFrame to a CSV file, ensuring each review is in its own row
reviews_df.to_csv('reviews.csv', index=False, encoding='utf-8')

