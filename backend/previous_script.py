# @title
import requests
import json

# Following values your data :-
store_url = "https://domain.myshopify.com"
store_name = "domain.myshopify.com"
store_front_name = "digilog.pk"
bing_indexing_url = "https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=*****************************"


def fetch_url_from_webhook():
    # TODO: Bussiness Logic to add here
    urls = []
    return urls


def indexing_Urls(product_urls: list):
    if product_urls:
        global store_front_name
        headers = {
            "Content-Type": "application/json",
        }
        batch_size = 225
        # Splitting the product URLs into batches of 250
        batches = [
            product_urls[i : i + batch_size]
            for i in range(0, len(product_urls), batch_size)
        ]
        total_indexed = 0  # Variable to store the total count of indexed URLs

        for batch in batches:
            data = {"siteUrl": f"http://www.{store_front_name}", "urlList": batch}

            response = requests.post(
                bing_indexing_url, headers=headers, data=json.dumps(data)
            )

            if response.status_code == 200:
                indexed_count = len(batch)
                total_indexed += indexed_count  # Update the total count
                print(f"{indexed_count} URLs submitted successfully")
            else:
                print(f"Error: {response.status_code} - {response.text}")
                break  # Stop the loop if there's an error

        return total_indexed  # Return the total count of indexed URLs


try:
    product_front_url = fetch_url_from_webhook()

    if product_front_url:
        last_row_no = indexing_Urls(product_front_url)

except Exception as e:
    print(f"Unexpected error: {e}")
