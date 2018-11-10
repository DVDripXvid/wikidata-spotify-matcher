import { AuthConfig } from 'angular-oauth2-oidc';

export const spotifyAuthConfig: AuthConfig = {
  loginUrl: 'https://accounts.spotify.com/authorize',
  redirectUri: window.location.origin + '/index.html',
  clientId: '1b93280bddbd4807bf755f609beccea4',
  scope: 'user-library-read',
  responseType: 'token',
  oidc: false,
}