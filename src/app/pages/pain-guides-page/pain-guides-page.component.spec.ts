import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainGuidesPageComponent } from './pain-guides-page.component';

describe('PainGuidesPageComponent', () => {
  let component: PainGuidesPageComponent;
  let fixture: ComponentFixture<PainGuidesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainGuidesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainGuidesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
