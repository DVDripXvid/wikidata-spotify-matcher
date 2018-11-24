import { backendConfig } from './../../config/backend-config';
import { ByIdQueryOptions, WdkEntity } from './../../models/wikidata-models';
import { Injectable } from '@angular/core';
import wdk from 'wikidata-sdk';
import { propertyIds } from '../../config/wikidata.config';
import { findSongsByTitleSparql } from './sparql-queries';

@Injectable({
  providedIn: 'root'
})
export class WikidataService {

  createSong(name: string, artists: string[], spotifyId: string) {
    return fetch(backendConfig.host, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, artists, spotifyId }),
    });
  }

  setSpotifyTrackIdForEntity(entityId: string, spotifyId: string) {
    return fetch(backendConfig.host, {
      method: 'PUT',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityId, spotifyId }),
    });
  }

  getSongBySpotifyId(spotifyId: string) {
    return this.getEntityByClaim(propertyIds.spotifyTrackId, spotifyId);
  }

  getArtistBySpotifyId(spotifyId: string) {
    return this.getEntityByClaim(propertyIds.spotifyArtistId, spotifyId);
  }

  getAlbumBySpotifyId(spotifyId: string) {
    return this.getEntityByClaim(propertyIds.spotifyAlbumId, spotifyId);
  }

  async findSongsByTitle(title: string) {
    const sparql = findSongsByTitleSparql(title);
    const ids: string[] = await this.executeSparql(sparql);
    if (ids.length === 0) {
      return null;
    }
    const entities = await this.getEntities(new ByIdQueryOptions(ids));
    return Object.values(entities);
  }

  async getEntities(query: ByIdQueryOptions): Promise<WdkEntity[]> {
    const queryUrl = wdk.getEntities(query);
    const results = await this.getJson(queryUrl);
    return wdk.simplify.entities(results.entities);
  }

  private async executeSparql(sparql: string) {
    const url = wdk.sparqlQuery(sparql);
    const results = await this.getJson(url);
    return wdk.simplifySparqlResults(results);
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
      return resultWrapper;
    }
    resultWrapper.ids = ids;
    const query = new ByIdQueryOptions(ids);
    resultWrapper.entities = await this.getEntities(query);
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
