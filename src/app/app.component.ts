import { spotify } from './config/spotify-api.config';
import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { spotifyAuthConfig } from './config/spotify-auth.config';
import { WikidataService } from './services/wikidata/wikidata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'wikidata-spotify-matcher';
  username = '';

  constructor(
    private oauthService: OAuthService,
    private wikidata: WikidataService) {

    wikidata.getArtistBySpotifyId('7dGJo4pcD2V6oG8kP0tJRR').then(eminem => console.log(eminem));
    this.configureSpotifyAuth()
      .then(() => spotify.getMe())
      .then(me => this.username = me.display_name);
  }

  private configureSpotifyAuth() {
    this.oauthService.configure(spotifyAuthConfig);
    this.oauthService.setStorage(sessionStorage);
    return this.oauthService.tryLogin().then((isSuccess) => {
      if (isSuccess) {
        spotify.setAccessToken(this.oauthService.getAccessToken());
      } else {
        this.oauthService.initImplicitFlow();
      }
    });
  }

}
