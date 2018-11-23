import { ArtistWithAlbums } from './../../models/spotify-models';
import { Component, OnInit } from '@angular/core';
import { spotify } from 'src/app/config/spotify-api.config';
import { Library } from 'src/app/models/spotify-models';
import {WikidataService} from 'src/app/services/wikidata/wikidata.service';

@Component({
  selector: 'app-library-tree',
  templateUrl: './library-tree.component.html',
  styleUrls: ['./library-tree.component.sass']
})
export class LibraryTreeComponent implements OnInit {

  constructor(private wikidataService: WikidataService) { }

  isLoading = false;
  library: ArtistWithAlbums[] = [];
  tracks: SpotifyApi.TrackObjectFull[] = [];

  async ngOnInit() {
    this.isLoading = true;
    this.tracks = await this.getFullLibrary();
    this.library = this.groupByArtistAndAlbum(this.tracks);
    this.isLoading = false;
    this.wikidataService.writeTest();
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

}
