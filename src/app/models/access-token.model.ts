export class AccessToken {
  token: string;
  expiration: Date;

  constructor(token: string, expiration: Date) {
    this.token = token;
    this.expiration = expiration;
  }
}
