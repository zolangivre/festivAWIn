import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionQuantiteComponent } from './selection-quantite.component';

describe('SelectionQuantiteComponent', () => {
  let component: SelectionQuantiteComponent;
  let fixture: ComponentFixture<SelectionQuantiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionQuantiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionQuantiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
