from django.core.management.base import BaseCommand
from django.db.models import Count
from api.models import Artist, Song, Setlist, TopSong
from collections import Counter

class Command(BaseCommand):
    help = "Calculate and populate TopSong for all artists based on their stored setlists"

    def add_arguments(self, parser):
        parser.add_argument('--mbid', type=str, help='Fetch top songs only for artist with this MBID')
        parser.add_argument('--n_songs', type=int, default=15, help='Fetch this many top songs')


    def handle(self, *args, **options):
        n_songs = options['n_songs']
        only_mbid = options['mbid']
        self.stdout.write("Starting TopSong population...")

        for artist in Artist.objects.all():
            if only_mbid is not None and artist.mbid != only_mbid:
                print(f"Skipped {artist}")
                continue
            setlists = Setlist.objects.filter(artist=artist).prefetch_related('songs')
            if not setlists.exists():
                self.stdout.write(f"No setlists found for artist {artist}. Skipping.")
                continue
            
            
            # Count all song plays across all setlists for this artist
            song_counter = Counter()
            for setlist in setlists:
                for song in setlist.songs.all():
                    song_counter[song.name] += 1
            
            if not song_counter:
                self.stdout.write(f"No songs found for artist {artist}. Skipping.")
                continue

            # Clear old TopSong entries for this artist before updating
            TopSong.objects.filter(artist=artist).delete()
            top_songs = song_counter.most_common(n_songs)

            for title, count in top_songs:
                TopSong.objects.create(artist=artist, title=title, count=count, n_setlists=len(setlists))

            self.stdout.write(f"Populated TopSong for {artist}: {len(top_songs)} songs.")

        self.stdout.write("Finished TopSong population.")
