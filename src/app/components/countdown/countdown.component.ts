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
  private intervalId: any;

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    this.sessionService.getNextPlannedSession().subscribe(
      (session) => {
        const startDate = new Date(session.dateDebut);
        this.intervalId = setInterval(() => {
          const now = new Date().getTime();
          const distance = startDate.getTime() - now;
          if (distance <= 0) {
            clearInterval(this.intervalId);
            this.router.navigate(['/jeuDepot']);
          } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            this.countdown = `${days}j ${hours}h ${minutes}m ${seconds}s`;
          }
        }, 1000);
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération de la prochaine session planifiée:',
          error
        );
      }
    );
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
