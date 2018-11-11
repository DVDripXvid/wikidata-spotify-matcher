import { classIds, propertyIds } from 'src/app/config/wikidata.config';

export const findSongsByTitleSparql = (title: string, limit = 20) => `
  SELECT ?item WHERE {
    ?item wdt:${propertyIds.instanceOf} wd:${classIds.song}.
    ?item ?label "${title}"@en.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  } LIMIT ${limit}`;
