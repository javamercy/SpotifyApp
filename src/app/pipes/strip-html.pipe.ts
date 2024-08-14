import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "stripHtml",
  standalone: true,
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string): string {
    const tempEl = document.createElement("div");
    tempEl.innerHTML = value;
    console.log(tempEl);

    return tempEl.textContent || tempEl.innerText || "";
  }
}
