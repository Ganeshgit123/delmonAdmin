import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedingProductComponent } from './feeding-product.component';

describe('FeedingProductComponent', () => {
  let component: FeedingProductComponent;
  let fixture: ComponentFixture<FeedingProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedingProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedingProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
