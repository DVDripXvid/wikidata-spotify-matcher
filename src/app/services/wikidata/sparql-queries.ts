import { classIds, propertyIds } from 'src/app/config/wikidata.config';

export const findSongsByTitleSparql = (title: string, limit = 20) => `
  SELECT ?item WHERE {
    ?item wdt:${propertyIds.instanceOf} ?type.
    FILTER(?type = wd:${classIds.song} || ?type = wd:${classIds.single}).
    ?item ?label "${title}"@en.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  } LIMIT ${limit}`;
