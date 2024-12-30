import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAchatListComponent } from './user-achat-list.component';

describe('UserAchatListComponent', () => {
  let component: UserAchatListComponent;
  let fixture: ComponentFixture<UserAchatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAchatListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAchatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
