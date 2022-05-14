import { isEmpty } from 'utils/string';
import { ListItem } from 'utils/typings';
import { beautifyUrl } from 'utils/url';

export interface PocketItem {
  domain_metadata?: {
    greyscale_logo: string;
    logo: string;
    name: string;
  };
  excerpt: string;
  given_title: string;
  given_url: string;
  item_id: string;
  resolved_id: string;
  resolved_title: string;
  resolved_url: string;
  time_added: string;
  time_updated: string;
  tags?: Record<string, Record<string, unknown>>;
}

export const itemToListItem = (item: PocketItem): ListItem => {
  const url = isEmpty(item.given_url) ? item.given_url : item.resolved_url;
  let title = isEmpty(item.given_title) ? item.given_title : item.resolved_title;
  if (!title) title = beautifyUrl(url);

  return {
    id: item.item_id,
    title,
    url,
    logo: item.domain_metadata?.logo,
    tags: item.tags ? Object.keys(item.tags).sort() : [],
  };
};
