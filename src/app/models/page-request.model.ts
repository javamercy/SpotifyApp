export class PageRequest {
  limit?: number;
  offset?: number;

  constructor(limit?: number, offset?: number) {
    this.limit = limit;
    this.offset = offset;
  }
}
