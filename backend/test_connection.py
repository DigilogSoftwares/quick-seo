from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession
import json

# Configuration
target_url = 'https://domain.pk/products/crane-sli-safe-load-indicator'
JSON_KEY_FILE = "credentials.json"

# Note: The new library expects a LIST of scopes, not a string
SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"

try:
    # 1. Load and Authorize Credentials
    # We use from_service_account_file instead of from_json_keyfile_name
    credentials = service_account.Credentials.from_service_account_file(
        JSON_KEY_FILE, 
        scopes=SCOPES
    )

    # 2. Build the Authorized Session
    # This replaces credentials.authorize(httplib2.Http()). 
    # It acts exactly like a standard 'requests' session but handles auth automatically.
    http = AuthorizedSession(credentials)

    # 3. Build the request body
    print(f"Notifying for: {target_url}")
    content = {
        'url': target_url,
        'type': "URL_UPDATED"
    }

    # 4. Make the Request
    # Note: We use .post() with the 'json' parameter. 
    # This automatically handles json.dumps and setting Content-Type headers.
    response = http.post(ENDPOINT, json=content)

    # 5. Parse Response
    # The response object has a .status_code and .json() method built-in
    print(f"Status Code: {response.status_code}")
    result = response.json()
    
    print("Result:")
    print(json.dumps(result, indent=2))

except Exception as e:
    print(f"An error occurred: {e}")