import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanelledOrdersComponent } from './canelled-orders.component';

describe('CanelledOrdersComponent', () => {
  let component: CanelledOrdersComponent;
  let fixture: ComponentFixture<CanelledOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanelledOrdersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanelledOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
