import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinWheelWinnerComponent } from './spin-wheel-winner.component';

describe('SpinWheelWinnerComponent', () => {
  let component: SpinWheelWinnerComponent;
  let fixture: ComponentFixture<SpinWheelWinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpinWheelWinnerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinWheelWinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
