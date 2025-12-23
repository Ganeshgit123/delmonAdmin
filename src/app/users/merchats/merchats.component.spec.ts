import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchatsComponent } from './merchats.component';

describe('MerchatsComponent', () => {
  let component: MerchatsComponent;
  let fixture: ComponentFixture<MerchatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MerchatsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
