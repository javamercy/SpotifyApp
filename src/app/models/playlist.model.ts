import { Image } from "./image.model";
import { ListResponse } from "./list-response.model";
import { PlaylistTrackItem } from "./playlist-track-item.model";
import { User } from "./user.model";

export class Playlist {
  collaborative: boolean;
  description?: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href?: string;
    total: number;
  };
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: User;
  primary_color?: string;
  public: boolean;
  snapshot_id: string;
  tracks: ListResponse<PlaylistTrackItem>;
  type: string;
  uri: string;
}
