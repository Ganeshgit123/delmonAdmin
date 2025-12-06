import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushEmailComponent } from './push-email.component';

describe('PushEmailComponent', () => {
  let component: PushEmailComponent;
  let fixture: ComponentFixture<PushEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PushEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PushEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
