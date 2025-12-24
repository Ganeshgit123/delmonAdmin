import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PoultryRelatedComponent } from './poultry-related.component';

describe('PoultryRelatedComponent', () => {
  let component: PoultryRelatedComponent;
  let fixture: ComponentFixture<PoultryRelatedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PoultryRelatedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoultryRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
