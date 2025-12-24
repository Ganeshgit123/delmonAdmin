import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeedingRelatedComponent } from './feeding-related.component';

describe('FeedingRelatedComponent', () => {
  let component: FeedingRelatedComponent;
  let fixture: ComponentFixture<FeedingRelatedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FeedingRelatedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedingRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
