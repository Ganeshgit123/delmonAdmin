import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoultryRelatedComponent } from './poultry-related.component';

describe('PoultryRelatedComponent', () => {
  let component: PoultryRelatedComponent;
  let fixture: ComponentFixture<PoultryRelatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoultryRelatedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoultryRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
