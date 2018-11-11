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

  private async getEntityByClaim(claimId: string, claimValue: string): Promise<WdkEntity> {
    const result = await this.getEntitiesByClaim(claimId, claimValue);
    if (!result.ids || result.ids.length === 0) {
      return null;
    }
    if (result.ids.length > 1) {
      console.warn(`multiple match when calling getEntityByClaim. claimId: ${claimId},claimValue: ${claimValue}`);
      console.warn(result);
    }
    return result.entities[result.ids[0]];
  }

  private async getEntitiesByClaim(claimId: string, claimValue: string)
    : Promise<{
      ids: string[],
      entities: WdkEntity[];
    }> {
    const url = wdk.getReverseClaims(claimId, claimValue);
    const resultWrapper = {
      ids: null,
      entities: null,
    };
    const body = await this.getJson(url);
    const ids = wdk.simplify.sparqlResults(body);
    if (ids.length === 0) {
      return null;
    }
    resultWrapper.ids = ids;
    const query = new ByIdQueryOptions();
    query.ids = ids;
    const queryUrl = wdk.getEntities(query);
    const result = await this.getJson(queryUrl);
    resultWrapper.entities = wdk.simplify.entities(result.entities);
    return resultWrapper;
  }

  private async getJson(url: string) {
    const resp = await fetch(url);
    if (resp.ok) {
      return resp.json();
    } else {
      throw new Error(`${resp.status}: ${resp.statusText}`);
    }
  }
}
