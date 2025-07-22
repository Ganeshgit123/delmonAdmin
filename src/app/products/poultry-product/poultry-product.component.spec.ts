import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoultryProductComponent } from './poultry-product.component';

describe('PoultryProductComponent', () => {
  let component: PoultryProductComponent;
  let fixture: ComponentFixture<PoultryProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoultryProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoultryProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
