import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "../components/navbar/navbar.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule, NavbarComponent],
  exports: [CommonModule, NavbarComponent],
})
export class SharedModule {}
