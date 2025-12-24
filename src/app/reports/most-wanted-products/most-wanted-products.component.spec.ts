import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MostWantedProductsComponent } from './most-wanted-products.component';

describe('MostWantedProductsComponent', () => {
  let component: MostWantedProductsComponent;
  let fixture: ComponentFixture<MostWantedProductsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MostWantedProductsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostWantedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
