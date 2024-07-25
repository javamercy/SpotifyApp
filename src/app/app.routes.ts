import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./components/home/home.component").then(m => m.HomeComponent),
  },

  {
    path: "home",
    redirectTo: "",
    pathMatch: "full",
  },

  {
    path: "callback",
    loadComponent: () =>
      import("./components/spotify-callback/spotify-callback.component").then(
        m => m.SpotifyCallbackComponent
      ),
  },

  {
    path: "me/stats",
    loadComponent: () =>
      import("./components/stats/stats.component").then(m => m.StatsComponent),
  },

  {
    path: "playlist/:id",
    loadComponent: () =>
      import("./components/playlist/playlist.component").then(
        m => m.PlaylistComponent
      ),
  },
];
