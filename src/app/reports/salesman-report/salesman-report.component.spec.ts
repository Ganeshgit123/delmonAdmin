import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanReportComponent } from './salesman-report.component';

describe('SalesmanReportComponent', () => {
  let component: SalesmanReportComponent;
  let fixture: ComponentFixture<SalesmanReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesmanReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
