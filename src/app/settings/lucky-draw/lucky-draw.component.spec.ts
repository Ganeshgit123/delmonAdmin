import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuckyDrawComponent } from './lucky-draw.component';

describe('LuckyDrawComponent', () => {
  let component: LuckyDrawComponent;
  let fixture: ComponentFixture<LuckyDrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LuckyDrawComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LuckyDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
