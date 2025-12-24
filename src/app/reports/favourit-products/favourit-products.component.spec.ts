import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FavouritProductsComponent } from './favourit-products.component';

describe('FavouritProductsComponent', () => {
  let component: FavouritProductsComponent;
  let fixture: ComponentFixture<FavouritProductsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FavouritProductsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouritProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
