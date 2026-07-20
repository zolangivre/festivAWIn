import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BilanAcheteurComponent } from './bilan-acheteur.component';

describe('BilanAcheteurComponent', () => {
  let component: BilanAcheteurComponent;
  let fixture: ComponentFixture<BilanAcheteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BilanAcheteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BilanAcheteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
