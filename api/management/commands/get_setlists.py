from django.core.management.base import BaseCommand
from api.models import Artist, Setlist, Song
from api.apis.setlist_api.get_setlists import fetch_setlists_from_api
from datetime import datetime

class Command(BaseCommand):
    help = 'Fetch setlists from Setlist.fm and populate the database'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=5, help='Number of setlists to fetch per artist')
        parser.add_argument('--mbid', type=str, help='Fetch setlists only for artist with this MBID')

    def handle(self, *args, **options):
        limit = options['limit']
        only_mbid = options['mbid']
        artists = Artist.objects.exclude(mbid__isnull=True).exclude(mbid='')

        for artist in artists:
            if only_mbid is not None and artist.mbid != only_mbid:
                print(f"Skipped {artist}")
                continue
                
            self.stdout.write(f"Fetching setlists for {artist.name} (MBID: {artist.mbid})")
            try:
                setlists_data = fetch_setlists_from_api(artist.mbid, limit=limit)
                for setlist_data in setlists_data:
                    # Avoid duplicates
                    if Setlist.objects.filter(setlistfm_id=setlist_data['id']).exists():
                        continue

                    # Parse date
                    date_obj = datetime.strptime(setlist_data['eventDate'], "%d-%m-%Y").date()

                    # Create setlist
                    setlist = Setlist.objects.create(
                        artist=artist,
                        date=date_obj,
                        setlistfm_id=setlist_data['id']
                    )

                    # Link songs
                    for song_name in setlist_data['songs']:
                        if not song_name:
                            continue
                        song, _ = Song.objects.get_or_create(name=song_name)
                        setlist.songs.add(song)

                    self.stdout.write(f"  Added setlist with {setlist.songs.count()} songs.")

            except Exception as e:
                self.stderr.write(f"Error fetching setlists for {artist.name}: {str(e)}")
