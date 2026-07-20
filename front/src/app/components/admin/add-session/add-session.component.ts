import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../../services/session.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Fonction pour formater la date au format ISO avec heure
function formatToISOString(date: Date, hour: Date): string {
  const hours = hour.getHours();
  const minutes = hour.getMinutes();
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
  const formattedDate = date.toISOString().split('T')[0];
  const combinedDateTimeStr = `${formattedDate}T${formattedTime}:00`;
  const isoDate = new Date(combinedDateTimeStr);
  return isoDate.toISOString();
}

@Component({
  selector: 'app-add-session',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTimepickerModule,
  ],
  templateUrl: './add-session.component.html',
  styleUrl: './add-session.component.css',
})
export class AddSessionComponent {
  sessionForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.sessionForm = this.fb.group({
      dateDebut: ['', [Validators.required]],
      heureDebut: ['', [Validators.required]],
      dateFin: ['', [Validators.required]],
      heureFin: ['', [Validators.required]],
      fraisDepot: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.max(50),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      commission: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.max(50),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
    });
  }

  addSession(): void {
    if (this.sessionForm.valid) {
      const formValues = this.sessionForm.value;

      // Créer des objets Date pour dateDebut et dateFin
      const startDate = new Date(formValues.dateDebut);
      const startDateTime = formatToISOString(startDate, formValues.heureDebut);

      const endDate = new Date(formValues.dateFin);
      const endDateTime = formatToISOString(endDate, formValues.heureFin);

      // Créer un objet session avec dateDebut et dateFin sous forme de Date
      const session = {
        dateDebut: startDate,
        dateFin: endDate,
        fraisDepot: Number(formValues.fraisDepot),
        commission: Number(formValues.commission),
        statutSession: 'Planifiee',
      };

      // Convertie dateDebut et dateFin au format ISO avant d'envoyer au backend
      const sessionPayload = {
        ...session,
        dateDebut: startDateTime,
        dateFin: endDateTime,
      };

      console.log('Session payload:', sessionPayload);
      this.sessionService.addSession(session).subscribe(
        (response) => {
          console.log('Session ajoutée avec succès', response);
          this.snackBar.open('Session ajoutée avec succès', 'Fermer', {
            duration: 3000,
          });
          this.sessionForm.reset();
          this.router.navigate(['/']);
        },
        (error) => {
          // Vérifie si l'erreur est liée à un chevauchement
          if (error.status === 400 && error.error.message) {
            this.snackBar.open(error.error.message, 'Fermer', {
              duration: 3000,
            });
          } else {
            console.error("Erreur lors de l'ajout de la session", error);
            this.snackBar.open(
              'Erreur inconnue, veuillez réessayer.',
              'Fermer',
              {
                duration: 3000,
              }
            );
          }
        }
      );
    }
  }
}
