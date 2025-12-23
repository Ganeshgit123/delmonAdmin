import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoultyComponent } from './poulty.component';

describe('PoultyComponent', () => {
  let component: PoultyComponent;
  let fixture: ComponentFixture<PoultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoultyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
