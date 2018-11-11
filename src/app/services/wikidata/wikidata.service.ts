import { ByIdQueryOptions, WdkEntity } from './../../models/wikidata-models';
import { Injectable } from '@angular/core';
import wdk from 'wikidata-sdk';
import { propertyIds } from '../../config/wikidata.config';

@Injectable({
  providedIn: 'root'
})
export class WikidataService {

  constructor() { }

  getSongBySpotifyId(spotifyId: string) {
    return this.getEntityByClaim(propertyIds.spotifyTrackId, spotifyId);
  }

  getArtistBySpotifyId(spotifyId: string) {
    return this.getEntityByClaim(propertyIds.spotifyArtistId, spotifyId);
  }

  getAlbumBySpotifyId(spotifyId: string) {
    return this.getEntityByClaim(propertyIds.spotifyAlbumId, spotifyId);
  }

  private getEntityByClaim(claimId: string, claimValue: string): Promise<WdkEntity> {
    return this.getEntitiesByClaim(claimId, claimValue)
      .then(result => {
        if (!result.ids || result.ids.length == 0) {
          return null;
        }
        if (result.ids.length > 1) {
          console.warn(`multiple match when calling getEntityByClaim. claimId: ${claimId},claimValue: ${claimValue}`)
          console.warn(result);
        }
        return result.entities[result.ids[0]];
      });
  }

  private getEntitiesByClaim(claimId: string, claimValue: string)
    : Promise<{
      ids: string[],
      entities: WdkEntity[];
    }> {
    const url = wdk.getReverseClaims(claimId, claimValue);
    const resultWrapper = {
      ids: null,
      entities: null,
    }
    return this.getJson(url)
      .then(body => wdk.simplify.sparqlResults(body))
      .then((ids: string[]) => {
        if (ids.length == 0) {
          return null;
        }
        resultWrapper.ids = ids;
        const query = new ByIdQueryOptions();
        query.ids = ids;
        const queryUrl = wdk.getEntities(query);
        return this.getJson(queryUrl);
      })
      .then(result => {
        resultWrapper.entities = wdk.simplify.entities(result.entities);
        return resultWrapper;
      });
  }

  private getJson(url: string) {
    return fetch(url)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw `${resp.status}: ${resp.statusText}`
        }
      });
  }
}
