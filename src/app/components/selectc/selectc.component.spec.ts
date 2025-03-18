import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectcComponent } from './selectc.component';

describe('SelectcComponent', () => {
  let component: SelectcComponent;
  let fixture: ComponentFixture<SelectcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
