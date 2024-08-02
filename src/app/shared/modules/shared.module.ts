import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "../components/navbar/navbar.component";

@NgModule({
  declarations: [],
  imports: [CommonModule, NavbarComponent],
  exports: [CommonModule, NavbarComponent],
})
export class SharedModule {}
