export type Library = ArtistWithAlbums[];

export interface ArtistWithAlbums extends SpotifyApi.ArtistObjectSimplified {
    albums: AlbumWithTracks[];
}

export interface AlbumWithTracks extends SpotifyApi.AlbumObjectSimplified {
    tracks: SpotifyApi.TrackObjectFull[];
}
