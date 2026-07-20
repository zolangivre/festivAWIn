import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDepotComponent } from './user-depot.component';

describe('UserDepotComponent', () => {
  let component: UserDepotComponent;
  let fixture: ComponentFixture<UserDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDepotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
