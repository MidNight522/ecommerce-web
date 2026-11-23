import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';

@Component({
  selector: 'app-base-header',
  imports: [RouterLink],
  templateUrl: './base-header.component.html',
  styleUrl: './base-header.component.scss',
})
export class BaseHeaderComponent {
  readonly isAuthenticated = inject(AuthService).isAuthenticated;
}
