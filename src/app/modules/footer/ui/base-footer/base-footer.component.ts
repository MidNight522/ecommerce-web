import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-base-footer',
  imports: [RouterLink],
  templateUrl: './base-footer.component.html',
  styleUrl: './base-footer.component.scss',
})
export class BaseFooterComponent {
  readonly year = new Date().getFullYear();
}
