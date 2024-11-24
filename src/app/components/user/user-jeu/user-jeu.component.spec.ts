import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJeuComponent } from './user-jeu.component';

describe('UserJeuComponent', () => {
  let component: UserJeuComponent;
  let fixture: ComponentFixture<UserJeuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserJeuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserJeuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
