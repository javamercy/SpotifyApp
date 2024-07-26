export const environment = {
  production: false,
  spotify: {
    apiUrl: "https://api.spotify.com/v1",
    AuthorizeOptions: {
      url: "https://accounts.spotify.com/authorize",
      clientId: "8391e4bc1aa947a1a2e48479e1365329",
      responseType: "code",
      redirectUri: "http://localhost:4200/callback",
      scope:
        "user-read-private user-read-email user-top-read user-follow-read playlist-read-private playlist-read-collaborative",
    },
    TokenOptions: {
      url: "https://accounts.spotify.com/api/token",
      clientId: "8391e4bc1aa947a1a2e48479e1365329",
      clientSecret: "0e32ff1889d24a61a7f79c833f718482",
    },
  },
};
