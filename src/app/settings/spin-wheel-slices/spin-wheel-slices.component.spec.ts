import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinWheelSlicesComponent } from './spin-wheel-slices.component';

describe('SpinWheelSlicesComponent', () => {
  let component: SpinWheelSlicesComponent;
  let fixture: ComponentFixture<SpinWheelSlicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpinWheelSlicesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinWheelSlicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
