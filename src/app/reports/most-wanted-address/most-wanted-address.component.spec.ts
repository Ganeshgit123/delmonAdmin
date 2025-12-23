import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostWantedAddressComponent } from './most-wanted-address.component';

describe('MostWantedAddressComponent', () => {
  let component: MostWantedAddressComponent;
  let fixture: ComponentFixture<MostWantedAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MostWantedAddressComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MostWantedAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
