import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesComponent } from './internal-sales.component';

describe('InternalSalesComponent', () => {
  let component: InternalSalesComponent;
  let fixture: ComponentFixture<InternalSalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [InternalSalesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
