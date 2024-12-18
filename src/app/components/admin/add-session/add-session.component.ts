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
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-session',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
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
    this.sessionForm = this.fb.group(
      {
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
      },
      { validators: this.dateTimeValidator }
    );
  }

  addSession(): void {
    if (this.sessionForm.valid) {
      const formValues = this.sessionForm.value;
      const startDate = new Date(formValues.dateDebut);
      const [startHours, startMinutes] = formValues.heureDebut.split(':');
      startDate.setHours(startHours, startMinutes);

      const endDate = new Date(formValues.dateFin);
      const [endHours, endMinutes] = formValues.heureFin.split(':');
      endDate.setHours(endHours, endMinutes);

      const session = {
        dateDebut: startDate,
        dateFin: endDate,
        fraisDepot: Number(formValues.fraisDepot),
        statutSession: 'Planifiee',
      };
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
          console.error("Erreur lors de l'ajout de la session", error);
        }
      );
    }
  }

  dateTimeValidator(group: FormGroup): { [key: string]: any } | null {
    const dateDebut = group.get('dateDebut')?.value;
    const heureDebut = group.get('heureDebut')?.value;
    const dateFin = group.get('dateFin')?.value;
    const heureFin = group.get('heureFin')?.value;

    if (dateDebut && heureDebut && dateFin && heureFin) {
      const startDate = new Date(dateDebut);
      const [startHours, startMinutes] = heureDebut.split(':');
      startDate.setHours(startHours, startMinutes);

      const endDate = new Date(dateFin);
      const [endHours, endMinutes] = heureFin.split(':');
      endDate.setHours(endHours, endMinutes);

      if (startDate >= endDate) {
        return { dateTimeInvalid: true };
      }
    }
    return null;
  }

  goBack(): void {
    window.history.back();
  }
}
