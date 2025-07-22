import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAssignComponent } from './product-assign.component';

describe('ProductAssignComponent', () => {
  let component: ProductAssignComponent;
  let fixture: ComponentFixture<ProductAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAssignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
