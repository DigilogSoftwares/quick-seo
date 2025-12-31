import asyncio
import aiohttp
from google.oauth2 import service_account
import google.auth.transport.requests

# 1. Configuration
target_url = 'https://domain.pk/products/crane-sli-safe-load-indicator'
SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"

# 2. Your Credentials Dictionary
# (Paste your actual keys here as we discussed previously)
key_dict = {
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...YOUR_KEY...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-email@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-email"
}

def get_access_token():
    """
    Generates a fresh access token synchronously.
    (This only happens once per batch, so async isn't strictly necessary here)
    """
    creds = service_account.Credentials.from_service_account_info(
        key_dict, scopes=SCOPES
    )
    # Create a request object to refresh the token
    request = google.auth.transport.requests.Request()
    creds.refresh(request)
    return creds.token

async def notify_google(session, token, url):
    """
    The actual Async worker that sends the request.
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    body = {
        "url": url,
        "type": "URL_UPDATED"
    }

    try:
        async with session.post(ENDPOINT, json=body, headers=headers) as response:
            result = await response.json()
            if response.status == 200:
                print(f"✅ Success for: {url}")
                # print(result) # Uncomment to see full Google response
            else:
                print(f"❌ Failed ({response.status}) for: {url} - {result}")
    except Exception as e:
        print(f"⚠️ Error with {url}: {e}")

async def main():
    # 1. Get the token (Sync operation, but fast)
    try:
        print("🔑 Authenticating...")
        token = get_access_token()
    except Exception as e:
        print(f"Auth Error: {e}")
        return

    # 2. Create an Async Session and fire requests
    # Example: If you had a list, you could process 100 URLs here instantly.
    async with aiohttp.ClientSession() as session:
        print(f"🚀 Sending request for: {target_url}")
        
        # In a real scenario, you might create a list of tasks here
        await notify_google(session, token, target_url)

# Run the async loop
if __name__ == "__main__":
    asyncio.run(main())