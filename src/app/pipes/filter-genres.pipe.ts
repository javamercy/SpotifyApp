import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterGenres",
  standalone: true,
})
export class FilterGenresPipe implements PipeTransform {
  transform(genres: string[], filter: string): string[] {
    if (!filter) {
      return genres;
    }

    return genres.filter(genre =>
      genre.toLowerCase().includes(filter.toLowerCase())
    );
  }
}
