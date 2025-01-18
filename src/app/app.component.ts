import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from './services/session.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CountdownComponent } from './components/countdown/countdown.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-app',
  imports: [
    RouterModule,
    CommonModule,
    CountdownComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  public isActive: boolean = false;
  public isHomePage: boolean = false;
  constructor(
    private sessionService: SessionService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.sessionService.isSessionActive().subscribe(
      (response) => {
        this.isActive = response;
        if (this.isActive) {
          console.log('Une session est en cours.');
          // Logique pour gérer une session en cours
        } else {
          console.log('Aucune session en cours.');
          // Logique pour gérer l'absence de session en cours
        }
      },
      (error) => {
        console.error(
          'Erreur lors de la vérification de la session active:',
          error
        );
      }
    );
    // Mettre à jour le statut des sessions régulièrement
    setInterval(() => {
      this.sessionService.updateSessionStatus().subscribe();
    }, 1000);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (this.router.url === '/accueil') {
          this.renderer.addClass(document.body, 'home-background');
          this.renderer.removeClass(document.body, 'other-background');
        } else {
          this.renderer.addClass(document.body, 'other-background');
          this.renderer.removeClass(document.body, 'home-background');
        }
      });
  }
  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  redirectToVente(): void {
    this.router.navigate(['/vente']);
  }

  redirectToJeux(): void {
    this.router.navigate(['/jeuDepot']);
  }
}
