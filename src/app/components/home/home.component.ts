import { WikidataService } from './../../services/wikidata/wikidata.service';
import { Component, OnInit } from '@angular/core';
import { spotify } from 'src/app/config/spotify-api.config';
import { WdkSongWrapper } from 'src/app/models/wikidata-models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  title = 'wikidata-spotify-matcher';
  username = '';

  constructor(private wdk: WikidataService) {
  }

  async ngOnInit() {
    const me = await spotify.getMe();
    this.username = me.display_name;
  }

  async onTrackSelected(track: SpotifyApi.TrackObjectFull) {
    const entity = await this.wdk.getSongBySpotifyId(track.id);
    if (entity) {
      console.log('Yeah we found a song in wikidata by its spotify id!');
      console.log(entity);
      return;
    }
    const entities = await this.wdk.findSongsByTitle(track.name);
    if (!entities || entities.length === 0) {
      console.warn('Not found in wikidata: ' + track.name);
      return;
    }
    console.log('Found songs in wikidata for: ' + track.name);
    Object.values(entities).forEach(async e => {
      const song = new WdkSongWrapper(e, this.wdk);
      await song.waitData;
      const albums = song.albums.map(a => a.labels.en).join(', ');
      const artists = song.artists.map(a => a.labels.en).join(', ');
      console.log(`${artists}: ${song.name} (${albums}) - ${song.description}`);
    });
  }

}
