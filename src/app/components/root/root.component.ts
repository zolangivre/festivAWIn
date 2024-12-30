import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-root',
    imports: [RouterModule, CommonModule, MatButtonModule, MatMenuModule],
    templateUrl: './root.component.html',
    styleUrl: './root.component.css'
})

export class RootComponent {
  buttonText: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.updateButtonText();
  }

  updateButtonText(): void {
    this.buttonText = this.router.url === '/jeuDepot'
      ? 'Vue Gestionnaire 🖲️'
      : 'Vue Acheteurs 🎲 et vendeurs 💶';
  }

  toggleRoute(): void {
    const newRoute = this.router.url === '/jeuDepot' ? '/utilisateur' : '/jeuDepot';
    this.router.navigate([newRoute]).then(() => this.updateButtonText());
  }

  toggleHome(): void {
    this.router.navigate(['/']).then(() => this.updateButtonText());
  }

}
