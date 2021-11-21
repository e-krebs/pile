export interface PocketRequest {
  code: string;
}

export interface PocketAuthorize {
  access_token: string;
  username: string;
}

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
export interface PocketList {
  list: Record<number, PocketItem>
}

export interface PocketSend {
  action_results: boolean[];
}
