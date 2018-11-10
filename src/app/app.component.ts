import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { spotifyAuthConfig } from './config/spotify-auth.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'wikidata-spotify-matcher';

  constructor(private oauthService: OAuthService) {
    this.configureSpotifyAuth();
  }

  private configureSpotifyAuth() {
    this.oauthService.configure(spotifyAuthConfig);
    this.oauthService.setStorage(sessionStorage);
    this.oauthService.tryLogin().then((isSuccess) => {
      if (!isSuccess) {
        this.oauthService.initImplicitFlow();
      }
    });
  }
}
