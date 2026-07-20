import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './root.component.html',
  styleUrl: './root.component.css',
})
export class RootComponent {
  buttonText: string = '';
  idUtilisateur: string | null = null;
  isGestionnaire: boolean = false;
  isAdmin: boolean = false;
  isAuthentified: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.updateAuthStatus();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateAuthStatus();
      });
  }

  updateAuthStatus(): void {
    this.isGestionnaire = this.authService.isGestionnaire();
    this.isAdmin = this.authService.isAdmin();
    this.isAuthentified = this.authService.isAuthenticated();
  }

  goBack(): void {
    const url = this.router.url;
    if (url.includes('utilisateur/')) {
      const segementUrl = url.split('/');
      const idUtilisateur = segementUrl[segementUrl.length - 1];
      this.router.navigate(['/utilisateur'], {
        queryParams: { idUtilisateur },
      });
    } else {
      window.history.back();
    }
  }

  toggleHome(): void {
    this.router.navigate(['/accueil']);
  }

  connexion(): void {
    this.router.navigate(['/login']);
  }

  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  gestionnaire(): void {
    this.router.navigate(['/utilisateur']);
  }

  goToSession(): void {
    this.router.navigate(['/session']);
  }
}
