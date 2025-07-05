from django.db import models

class Artist(models.Model):
    name = models.CharField(max_length=100, unique=True)
    mbid = models.CharField(max_length=100, unique=True, null=True, blank=True)

    def __str__(self):
        return self.name
    
class Song(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)

class Setlist(models.Model):
    artist = models.ForeignKey(Artist, related_name='setlists', on_delete=models.CASCADE)
    date = models.DateField()
    songs = models.ManyToManyField(Song)
    setlistfm_id = models.CharField(max_length=100, unique=True, null=True, blank=True)

    def __str__(self):
        return f"{self.artist.name} at {self.venue} on {self.date}"


class TopSong(models.Model):
    artist = models.ForeignKey(Artist, related_name='top_songs', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    count = models.PositiveIntegerField()
    n_setlists = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('artist', 'title')
        ordering = ['-count']

    def __str__(self):
        return f"{self.title} ({self.count})"
