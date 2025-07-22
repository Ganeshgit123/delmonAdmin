import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneDayOrdersComponent } from './one-day-orders.component';

describe('OneDayOrdersComponent', () => {
  let component: OneDayOrdersComponent;
  let fixture: ComponentFixture<OneDayOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneDayOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneDayOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
