import { propertyIds } from './../config/wikidata.config';
import { WikidataService } from './../services/wikidata/wikidata.service';

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

export class WdkSongWrapper {

    private static readonly relatedPropIds = [
        propertyIds.genre,
        propertyIds.partOf,
        propertyIds.performer,
    ];
    private relatedEntites: WdkEntity[] = [];
    public readonly waitData: Promise<any>;

    constructor(
        private entity: WdkEntity,
        service: WikidataService
    ) {
        let ids: string[] = [];
        WdkSongWrapper.relatedPropIds.forEach(propId => {
            if (entity.claims[propId]) {
                ids = ids.concat(entity.claims[propId]);
            }
        });
        if (ids.length === 0) {
            this.waitData = Promise.resolve();
            return;
        }
        this.waitData = service.getEntities(new ByIdQueryOptions(ids))
            .then(entites => this.relatedEntites = Object.values(entites));
    }

    get name() {
        return this.entity.labels.en;
    }

    get description() {
        return this.entity.descriptions.en;
    }

    get artists() {
        const ids = this.entity.claims[propertyIds.performer];
        return ids
            ? this.findEntitesByIds(ids)
            : [];
    }

    get albums() {
        const ids = this.entity.claims[propertyIds.partOf];
        return ids
            ? this.findEntitesByIds(ids)
            : [];
    }

    get genres() {
        const ids = this.entity.claims[propertyIds.genre];
        return ids
            ? this.findEntitesByIds(ids)
            : [];
    }

    get spotifyId() {
        const ids = this.entity.claims[propertyIds.spotifyTrackId];
        return this.entity.claims[propertyIds.spotifyTrackId]
            ? ids[0]
            : null;
    }

    get entityId() {
        return this.entity.id;
    }

    private findEntitesByIds(ids: string[]) {
        return this.relatedEntites.filter(e => ids.includes(e.id));
    }
}
