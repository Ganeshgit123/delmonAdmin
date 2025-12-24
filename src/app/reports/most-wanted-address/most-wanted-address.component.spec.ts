import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MostWantedAddressComponent } from './most-wanted-address.component';

describe('MostWantedAddressComponent', () => {
  let component: MostWantedAddressComponent;
  let fixture: ComponentFixture<MostWantedAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MostWantedAddressComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostWantedAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
