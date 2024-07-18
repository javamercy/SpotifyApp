import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "home",
    loadComponent: () =>
      import("./components/home/home.component").then(m => m.HomeComponent),
  },

  {
    path: "",
    loadComponent: () =>
      import("./components/home/home.component").then(m => m.HomeComponent),
  },

  {
    path: "callback",
    loadComponent: () =>
      import("./components/spotify-callback/spotify-callback.component").then(
        m => m.SpotifyCallbackComponent
      ),
  },
];
