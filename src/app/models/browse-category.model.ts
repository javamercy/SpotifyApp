import { Image } from "./image.model";

export interface BrowseCategory {
  href: string;
  icons: Image[];
  id: string;
  name: string;
}
