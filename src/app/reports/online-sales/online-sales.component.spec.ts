import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineSalesComponent } from './online-sales.component';

describe('OnlineSalesComponent', () => {
  let component: OnlineSalesComponent;
  let fixture: ComponentFixture<OnlineSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnlineSalesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
