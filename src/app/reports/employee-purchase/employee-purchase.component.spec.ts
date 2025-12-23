import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePurchaseComponent } from './employee-purchase.component';

describe('EmployeePurchaseComponent', () => {
  let component: EmployeePurchaseComponent;
  let fixture: ComponentFixture<EmployeePurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeePurchaseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
