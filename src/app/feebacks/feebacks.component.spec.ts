import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeebacksComponent } from './feebacks.component';

describe('FeebacksComponent', () => {
  let component: FeebacksComponent;
  let fixture: ComponentFixture<FeebacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeebacksComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeebacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
