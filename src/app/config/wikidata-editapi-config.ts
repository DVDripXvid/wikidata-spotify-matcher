import {config} from 'src/app/config/wikidata-auth.config';
import wikidateEdit from 'wikidata-edit';

export const wdEdit = new wikidateEdit(
    {
        username: config.username,
        password: config.password,
        bot: config.bot
 });
