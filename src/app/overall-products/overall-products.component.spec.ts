import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallProductsComponent } from './overall-products.component';

describe('OverallProductsComponent', () => {
  let component: OverallProductsComponent;
  let fixture: ComponentFixture<OverallProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
