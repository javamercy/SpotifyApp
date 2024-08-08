import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from "@angular/core";

@Directive({
  selector: "[appCircularProgressBar]",
  standalone: true,
})
export class CircularProgressBarDirective implements OnChanges {
  @Input("appCircularProgressBar") progress: {
    percentage: number;
    color: string;
    strokeWidth: number;
  } = { percentage: 0, color: "transparent", strokeWidth: 2 };

  private svg: SVGElement;
  private circleBg: SVGPathElement;
  private circle: SVGPathElement;
  private wrapper: HTMLElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.wrapper = this.renderer.createElement("div");
    this.renderer.setStyle(this.wrapper, "position", "relative");
    this.renderer.setStyle(this.wrapper, "display", "inline-block");

    this.svg = this.renderer.createElement("svg", "svg");
    this.circleBg = this.renderer.createElement("path", "svg");
    this.circle = this.renderer.createElement("path", "svg");

    this.renderer.setAttribute(this.svg, "viewBox", "0 0 36 36");
    this.renderer.setAttribute(this.circleBg, "class", "ek-circle-bg");
    this.renderer.setAttribute(
      this.circleBg,
      "d",
      "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
    );
    this.renderer.setStyle(
      this.circleBg,
      "stroke-width",
      `${this.progress.strokeWidth}px`
    );

    this.renderer.setAttribute(this.circle, "class", "ek-circle");
    this.renderer.setAttribute(
      this.circle,
      "d",
      "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
    );

    this.renderer.setStyle(this.circle, "stroke", this.progress.color);
    this.renderer.setStyle(
      this.circle,
      "stroke-width",
      `${this.progress.strokeWidth}px`
    );

    this.renderer.appendChild(this.svg, this.circleBg);
    this.renderer.appendChild(this.svg, this.circle);

    const nativeElement = this.el.nativeElement;
    const parent = this.renderer.parentNode(nativeElement);

    this.renderer.insertBefore(parent, this.wrapper, nativeElement);
    this.renderer.appendChild(this.wrapper, nativeElement);
    this.renderer.appendChild(this.wrapper, this.svg);

    this.adjustSvg();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["progress"]) {
      this.renderer.setAttribute(
        this.circle,
        "stroke-dasharray",
        `${this.progress.percentage}, 100`
      );
      this.renderer.setStyle(this.circle, "stroke", this.progress.color);
    }
  }

  private adjustSvg(): void {
    const iconElement = this.el.nativeElement;

    if (iconElement) {
      const width = parseInt(iconElement.getAttribute("width") || "50", 10);
      const height = parseInt(iconElement.getAttribute("height") || width, 10);

      this.renderer.setStyle(this.svg, "width", `${width * 1.1}px`);
      this.renderer.setStyle(this.svg, "height", `${height * 1.1}px`);
      this.renderer.setStyle(this.svg, "position", "absolute");
      this.renderer.setStyle(this.svg, "top", "50%");
      this.renderer.setStyle(this.svg, "left", "50%");
      this.renderer.setStyle(this.svg, "transform", "translate(-50%, -50%)");
    }
  }
}
