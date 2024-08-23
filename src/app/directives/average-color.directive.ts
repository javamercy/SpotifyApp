import { Directive, ElementRef, Input, Renderer2, OnInit } from "@angular/core";
import { FastAverageColor } from "fast-average-color";

@Directive({
  selector: "[appAverageColor]",

  standalone: true,
})
export class AverageColorDirective implements OnInit {
  @Input("appAverageColor") imageUrl: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.setAverageColor();
  }

  private setAverageColor() {
    const fac = new FastAverageColor();
    fac
      .getColorAsync(this.imageUrl)
      .then(color => {
        this.renderer.setStyle(
          this.el.nativeElement,
          "background-color",
          color.hex
        );
        const luminance = this.calculateLuminance(color.value);
        const textColor = luminance > 0.5 ? "#000" : "#FFF";

        this.renderer.setStyle(this.el.nativeElement, "color", textColor);
      })
      .catch(e => {
        console.error(e);
      });
  }

  private calculateLuminance([R, G, B]: number[]): number {
    const rNormalized = R / 255;
    const gNormalized = G / 255;
    const bNormalized = B / 255;

    return 0.21 * rNormalized + 0.72 * gNormalized + 0.07 * bNormalized;
  }
}
