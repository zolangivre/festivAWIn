import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { tap } from 'rxjs/operators';

export const SessionGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  return sessionService.isSessionActive().pipe(
  tap(isActive => {
    if (!isActive) {
      router.navigate(['/countdown']);
    }
  }
    ));
};
