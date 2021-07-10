import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCampaignItemComponent } from './edit-campaign-item.component';

describe('EditCampaignItemComponent', () => {
  let component: EditCampaignItemComponent;
  let fixture: ComponentFixture<EditCampaignItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCampaignItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCampaignItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
