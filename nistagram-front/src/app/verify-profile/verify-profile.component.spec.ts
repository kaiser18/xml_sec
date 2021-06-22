import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyProfileComponent } from './verify-profile.component';

describe('VerifyProfileComponent', () => {
  let component: VerifyProfileComponent;
  let fixture: ComponentFixture<VerifyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
