import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletReportComponent } from './wallet-report.component';

describe('WalletReportComponent', () => {
  let component: WalletReportComponent;
  let fixture: ComponentFixture<WalletReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
