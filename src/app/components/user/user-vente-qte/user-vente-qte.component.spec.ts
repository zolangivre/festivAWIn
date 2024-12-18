import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVenteQteComponent } from './user-vente-qte.component';

describe('UserVenteQteComponent', () => {
  let component: UserVenteQteComponent;
  let fixture: ComponentFixture<UserVenteQteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserVenteQteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserVenteQteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
