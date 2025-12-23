import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupOrdersComponent } from './pickup-orders.component';

describe('PickupOrdersComponent', () => {
  let component: PickupOrdersComponent;
  let fixture: ComponentFixture<PickupOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PickupOrdersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
