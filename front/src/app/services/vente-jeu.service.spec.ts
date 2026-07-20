import { TestBed } from '@angular/core/testing';

import { VenteJeuService } from './vente-jeu.service';

describe('VenteJeuService', () => {
  let service: VenteJeuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VenteJeuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
