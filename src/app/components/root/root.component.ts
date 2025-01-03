import { Component } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.updateButtonText();
  }

  updateButtonText(): void {
    this.buttonText =
      this.router.url === '/jeuDepot'
        ? 'Interface gestionnaire'
        : 'Interface utilisateur';
  }

  toggleRoute(): void {
    const newRoute =
      this.router.url === '/jeuDepot' ? '/utilisateur' : '/jeuDepot';
    this.router.navigate([newRoute]).then(() => this.updateButtonText());
  }

  toggleHome(): void {
    this.router.navigate(['/']).then(() => this.updateButtonText());
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
}
