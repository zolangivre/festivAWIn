import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.css',
})
export class CountdownComponent {
  countdown: string = '';
  message: string = '';
  private intervalId: any;

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    // Vérifie si une session est active
    this.sessionService.updateSessionStatus().subscribe();
    this.sessionService.isSessionActive().subscribe(
      (isActive) => {
        if (isActive) {
          // Si une session est active, affiche un compte à rebours jusqu'à la fin
          this.sessionService.getSessionEnCours().subscribe(
            (session) => {
              const endDate = new Date(session.dateFin);
              this.startCountdown(endDate, 'Une session a commencé et finira dans');
            },
            (error) => {
              console.error(
                'Erreur lors de la récupération de la session active:',
                error
              );
            }
          );
        } else {
          // Sinon, recherche la prochaine session et affiche un compte à rebours jusqu'à son début
          this.sessionService.getNextPlannedSession().subscribe(
            (session) => {
              console.log('Prochaine session planifiée:', session);
              const startDate = new Date(session.dateDebut);
              this.startCountdown(
                startDate,
                'La prochaine session débutera dans'
              );
            },
            (error) => {
              console.error(
                'Erreur lors de la récupération de la prochaine session planifiée:',
                error
              );
            }
          );
        }
      },
      (error) => {
        console.error(
          'Erreur lors de la vérification de la session active:',
          error
        );
      }
    );
  }

  private startCountdown(targetDate: Date, message: string): void {
    this.message = message;
    this.intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(this.intervalId);
        this.countdown = `${this.message} est terminée.`;
        window.location.reload();
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        this.countdown = `${days}j ${hours}h ${minutes}m ${seconds}s`;
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
