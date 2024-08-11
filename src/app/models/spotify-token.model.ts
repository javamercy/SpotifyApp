export class SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;

  constructor(
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string
  ) {
    this.access_token = access_token;
    this.token_type = token_type;
    this.expires_in = expires_in;
    this.refresh_token = refresh_token;
    this.scope = scope;
  }
}
