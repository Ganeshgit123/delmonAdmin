import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedingRelatedComponent } from './feeding-related.component';

describe('FeedingRelatedComponent', () => {
  let component: FeedingRelatedComponent;
  let fixture: ComponentFixture<FeedingRelatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedingRelatedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedingRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
