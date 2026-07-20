import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVenteListComponent } from './user-vente-list.component';

describe('UserVenteListComponent', () => {
  let component: UserVenteListComponent;
  let fixture: ComponentFixture<UserVenteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserVenteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserVenteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
