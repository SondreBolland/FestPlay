import os
import requests

BASE_URL = "https://musicbrainz.org/ws/2/artist"
HEADERS = {
    "User-Agent": os.getenv("USER_AGENT")
}

def search_artists(query: str, limit: int = 5):
    """
    Search MusicBrainz for artist matches.
    Returns a list of dicts with artist name, mbid, and disambiguation.
    """
    params = {
        "query": f"artist:{query}",
        "fmt": "json",
        "limit": limit
    }
    try:
        response = requests.get(BASE_URL, params=params, headers=HEADERS)
        response.raise_for_status()
        data = response.json()

        return [
            {
                "name": artist.get("name"),
                "mbid": artist.get("id"),
                "disambiguation": artist.get("disambiguation", ""),
                "country": artist.get("country", "")
            }
            for artist in data.get("artists", [])
        ]

    except requests.RequestException as e:
        print(f"Error searching MusicBrainz: {e}")
        return []