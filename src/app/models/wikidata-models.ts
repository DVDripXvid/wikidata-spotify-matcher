import { ClaimsMap } from './wikidata-models';

export class ByIdQueryOptions {
    ids: string[];
    languages?: string[] = ['en'];
    props?: string[] = ['info', 'claims', 'id', 'descriptions', 'labels'];
    format = 'json';

    constructor(ids: string[]) {
        this.ids = ids;
    }
}

export interface WdkEntity {
    claims: ClaimsMap;
    descriptions: {
        en: string;
    };
    id: string;
    labels: {
        en: string;
    };
    modified: Date;
    type: string;
}

export interface ClaimsMap {
    [propId: string]: string[];
}