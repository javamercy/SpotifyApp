import { Image } from "./image.model";

export class User {
  id: string;
  display_name: string;
  email: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  href: string;
  images: Image[];
  type: string;
  uri: string;
}
