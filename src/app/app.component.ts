import { Component } from '@angular/core';
import { SessionService } from './services/session.service';
import { Router, RouterModule } from '@angular/router';
import { CountdownComponent } from './components/countdown/countdown.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-app',
  standalone: true,
  imports: [ RouterModule, CountdownComponent, MatButtonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  public isActive: boolean = false;

  constructor(private sessionService: SessionService, private router: Router) {}

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
      this.sessionService.updateSessionStatus().subscribe(
        (response) => {
          console.log('Statuts des sessions mis à jour:', response);
        },
        (error) => {
          console.error(
            'Erreur lors de la mise à jour des statuts des sessions:',
            error
          );
        }
      );
    }, 60000); // Vérifier toutes les minutes
  }
  redirectToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
