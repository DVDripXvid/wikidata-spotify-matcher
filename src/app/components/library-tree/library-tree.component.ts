import { ArtistWithAlbums, AlbumWithTracks } from './../../models/spotify-models';
import { Component, OnInit, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { spotify } from 'src/app/config/spotify-api.config';
import { Library } from 'src/app/models/spotify-models';
import { WikidataService } from 'src/app/services/wikidata/wikidata.service';
import { WdkSongWrapper } from 'src/app/models/wikidata-models';

@Component({
  selector: 'app-library-tree',
  templateUrl: './library-tree.component.html',
  styleUrls: ['./library-tree.component.sass']
})
export class LibraryTreeComponent implements OnInit, AfterViewChecked {

  constructor (private wdk: WikidataService) {}

  selectedArtist: ArtistWithAlbums;
  selectedAlbum: AlbumWithTracks;
  selectedTrack: SpotifyApi.TrackObjectFull;
  artistSearchTerm = '';

  isLoading = false;
  wikiDetailsLoadMask = false;
  library: ArtistWithAlbums[] = [];
  tracks: SpotifyApi.TrackObjectFull[] = [];

  matchingWikidataSongs: WdkSongWrapper[] = [];
  matchFound = false;
  exactMatch = false;

  private unfilteredLibrary: ArtistWithAlbums[];
  private viewCheckedCallback: any;

  async ngOnInit() {
    this.isLoading = true;
    this.tracks = await this.getFullLibrary();
    this.unfilteredLibrary = this.groupByArtistAndAlbum(this.tracks);
    this.library = [...this.unfilteredLibrary];
    this.isLoading = false;
  }

  ngAfterViewChecked(): void {
    if (typeof this.viewCheckedCallback === 'function') {
      this.viewCheckedCallback();
    }
  }

  private waitForUpdate() {
    return new Promise((resolve, _reject) => {
      this.viewCheckedCallback = resolve;
    });
  }

  artistClicked(artist: ArtistWithAlbums) {
    this.waitForUpdate().then(this.scrollToTheRight);
    this.selectedArtist = artist;
    if (artist.albums.length === 1) {
      this.selectedAlbum = artist.albums[0];
    } else {
      this.selectedAlbum = null;
    }

    this.selectedTrack = null;
  }

  albumClicked(album: AlbumWithTracks) {
    this.waitForUpdate().then(this.scrollToTheRight);
    this.selectedAlbum = album;

    this.selectedTrack = null;
  }

  filterArtists(term: string) {
    this.artistSearchTerm = term;
    if (!term) {
      return;
    }
    this.library = this.unfilteredLibrary
      .filter(a => a.name.toLowerCase().includes(term.toLowerCase()));
  }

  private groupByArtistAndAlbum(library: SpotifyApi.TrackObjectFull[]): Library {
    const albumLib = library.reduce((albums, track) => {
      const album = albums.find(a => a.id === track.album.id);
      if (album) {
        album.tracks.push(track);
      } else {
        albums.push({
          ...track.album,
          artist: track.artists[0],
          tracks: [track]
        });
      }
      return albums;
    }, []);
    const artistLib = albumLib.reduce((artists, album) => {
      const artist = artists.find(a => a.id === album.artist.id);
      if (artist) {
        artist.albums.push(album);
      } else {
        artists.push({
          ...album.artist,
          albums: [album]
        });
      }
      return artists;
    }, []);
    return artistLib;
  }

  private async getFullLibrary() {
    const limit = 50;
    const firstResponse = await spotify.getMySavedTracks({ limit });
    let library = firstResponse.items;
    const promises = [];
    for (let offset = limit; offset < firstResponse.total; offset += limit) {
      const promise = spotify.getMySavedTracks({ limit, offset });
      promises.push(promise);
    }
    try {
      const responses = await Promise.all(promises);
      const itemsList = responses.map(r => r.items);
      library = library.concat(...itemsList);
    } catch (error) {
      console.error(error);
    }
    return library.map(t => t.track);
  }

  private scrollToTheRight() {
    window.scrollTo({
      top: 0,
      left: window.outerWidth,
      behavior: 'smooth',
    });
  }

  async onTrackSelected(track: SpotifyApi.TrackObjectFull) {
    this.matchingWikidataSongs = [];
    this.selectedTrack = track;
    this.wikiDetailsLoadMask = true;

    console.log('Selected track: ', this.selectedTrack);

    const entity = await this.wdk.getSongBySpotifyId(track.id);
    if (entity) {
      console.log('Yeah we found a song in wikidata by its spotify id!');
      const song = new WdkSongWrapper(entity, this.wdk);
      this.matchingWikidataSongs.push(song);

      console.log('The song:', song);

      this.waitForUpdate().then(this.scrollToTheRight);
      this.wikiDetailsLoadMask = false;
      this.matchFound = true;
      this.exactMatch = true;
      return;
    }
    const entities = await this.wdk.findSongsByTitle(track.name);
    if (!entities || entities.length === 0) {
      console.warn('Not found in wikidata: ' + track.name);

      this.waitForUpdate().then(this.scrollToTheRight);
      this.wikiDetailsLoadMask = false;
      this.matchFound = false;
      this.exactMatch = false;
      return;
    }
    console.log('Found songs in wikidata for: ' + track.name);
    Object.values(entities).forEach(async e => {
      const song = new WdkSongWrapper(e, this.wdk);
      await song.waitData;

      this.matchingWikidataSongs.push(song);
      this.waitForUpdate().then(this.scrollToTheRight);
      this.wikiDetailsLoadMask = false;
      this.matchFound = true;
      this.exactMatch = false;

      console.log('The song:', song);
    });
  }

  private getArtists(song: WdkSongWrapper) {
    return song.artists.map(a => a.labels['en']).join(', ');
  }

  private createSong(song: SpotifyApi.TrackObjectFull) {
    this.wikiDetailsLoadMask = true;
    this.wdk.createSong(song.name, song.artists.map(a => a.name), song.id).then(onSuccess => {
      this.wikiDetailsLoadMask = false;
      this.onTrackSelected(song);
    }).catch(onError => {
      console.error('Failed to create song:', song);
    });
  }

  private updateSpotifyIdForSong(song: WdkSongWrapper) {
    this.wikiDetailsLoadMask = true;
    this.wdk.setSpotifyTrackIdForEntity(song.entityId, this.selectedTrack.id).then(onSuccess => {
      this.wikiDetailsLoadMask = false;
      this.onTrackSelected(this.selectedTrack);
    }).catch(onError => {
      console.error('Failed to update song:', song);
    });
  }

  private hasArtist(song: WdkSongWrapper) {
    return song.artists !== undefined && song.artists.length > 0;
  }
}
