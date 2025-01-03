import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BilanGeneralComponent } from './bilan-general.component';

describe('BilanGeneralComponent', () => {
  let component: BilanGeneralComponent;
  let fixture: ComponentFixture<BilanGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BilanGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BilanGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
