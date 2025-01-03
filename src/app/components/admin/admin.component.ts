import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-admin',
    imports: [
        MatButtonModule,
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(private router: Router, private authService: AuthService) {
  }

  goToSession(): void {
    this.router.navigate(['/session']);
  }

  logout(): void {
    this.authService.logout();
  }

  goToAddSession(): void {
    this.router.navigate(['/addSession']);
  }
}
