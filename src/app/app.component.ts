import { spotify } from './config/spotify-api.config';
import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { spotifyAuthConfig } from './config/spotify-auth.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  constructor(
    private oauthService: OAuthService,
    private router: Router) {
    this.configureSpotifyAuth();
  }

  private async configureSpotifyAuth() {
    this.oauthService.configure(spotifyAuthConfig);
    this.oauthService.setStorage(sessionStorage);
    const isSuccess = await this.oauthService.tryLogin();
    if (isSuccess) {
      spotify.setAccessToken(this.oauthService.getAccessToken());
      this.router.navigate(['/home']);
    } else {
      this.oauthService.initImplicitFlow();
    }
  }

}
