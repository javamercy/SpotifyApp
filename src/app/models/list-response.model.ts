import { Paginate } from "./paginate.model";

export class ListResponse<T> extends Paginate {
  items: T[];
}
