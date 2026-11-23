import { Component, inject } from '@angular/core';
import {
  Router,
  RouterOutlet,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { DOCUMENT } from '@angular/common';
import { BaseHeaderComponent } from './modules/header/ui/base-header/base-header.component';
import { BaseFooterComponent } from './modules/footer/ui/base-footer/base-footer.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastModule,
    BaseHeaderComponent,
    BaseFooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly router = inject(Router);

  readonly navigating = toSignal(
    this.router.events.pipe(
      filter(
        (event) =>
          event instanceof NavigationStart ||
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError,
      ),
      map((event) => event instanceof NavigationStart),
    ),
    { initialValue: false },
  );
  private readonly document = inject(DOCUMENT);
  isDark = false;

  toggleTheme(): void {
    this.isDark = this.document.documentElement.classList.toggle('app-dark');
  }
}
