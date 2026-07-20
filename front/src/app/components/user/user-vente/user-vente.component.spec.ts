import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVenteComponent } from './user-vente.component';

describe('UserVenteComponent', () => {
  let component: UserVenteComponent;
  let fixture: ComponentFixture<UserVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserVenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
