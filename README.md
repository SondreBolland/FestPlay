#  Festival Playlist Generator (Web App)

**Get ready for your next festival or concert!**
This web app helps you generate personalized Spotify playlists based on what your favorite artists most frequently perform live.

Using recent concert data from [setlist.fm](https://www.setlist.fm) and Spotify, this tool makes it easy to:

* **Search and add artists**
* **View their most frequently played live songs**
* **Log in with Spotify**
* **Generate custom playlists** for your upcoming events

All from a user-friendly web interface — no API keys or technical setup required.

---

##  Features

*  **Search and add artists** using the [MusicBrainz](https://musicbrainz.org/) database
*  **View top live songs** each artist plays most often
*  **Smart playlist generator**:

  * Choose how many songs to include per artist
  * Optionally include multiple artists in one playlist
*  **Spotify login and playlist creation**
*  Built with **Django (backend)** and **React (frontend)**

---

##  How It Works

1. **Search and add artists** to your selection using a powerful MusicBrainz-integrated search.
2. **Browse their most frequently played songs** based on recent setlist.fm data.
3. **Log in to Spotify** securely.
4. **Choose how many songs** you want from each artist.
5. **Generate a playlist** right in your Spotify account with a single click.

---

## Tech Stack

* **Frontend**: React + Vite + Tailwind CSS
* **Backend**: Django + Django REST Framework
* **Data sources**:

  * [MusicBrainz](https://musicbrainz.org) (for artist search)
  * [setlist.fm](https://www.setlist.fm) (for live song data)
  * [Spotify Web API](https://developer.spotify.com) (for playlist creation)

---

##  Screenshots (optional)

*Add screenshots here if you'd like — e.g., artist search, playlist creation confirmation, etc.*

---

## Deployment

This project can be deployed as a full-stack web app.

If self-hosting:

### Backend (Django)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Make sure the frontend is set up to proxy API calls to the Django server.

---

##  Development Notes

* All API keys are handled server-side. Users **do not** need to register with setlist.fm or Spotify.
* The app caches setlist data to reduce API usage and improve performance.
* Django handles Spotify OAuth securely and issues tokens needed for playlist generation.

---

## 🙋 Who is this for?

Anyone preparing for concerts or festivals — music fans who want to get familiar with the songs they’re most likely to hear live!

---

## License

MIT License (or specify your preferred license)

---

## Made by

[**Sondre Sæther Bolland**](https://www4.uib.no/finn-ansatte/Sondre.S%C3%A6ther.Bolland)

---

