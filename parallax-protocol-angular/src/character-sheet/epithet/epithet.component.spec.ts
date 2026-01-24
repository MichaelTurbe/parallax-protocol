import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpithetComponent } from './epithet.component';

describe('EpithetComponent', () => {
  let component: EpithetComponent;
  let fixture: ComponentFixture<EpithetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpithetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpithetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
