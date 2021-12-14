import { isEmpty } from 'utils/string';
import { ListItem } from 'utils/typings';

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
}

export const itemToListItem = (item: PocketItem): ListItem => ({
  id: item.item_id,
  title: isEmpty(item.given_title) ? item.given_title : item.resolved_title,
  url: isEmpty(item.given_url) ? item.given_url : item.resolved_url,
  logo: item.domain_metadata?.logo,
});
