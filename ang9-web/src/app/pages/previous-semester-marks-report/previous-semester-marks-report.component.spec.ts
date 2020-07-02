import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousSemesterMarksReportComponent } from './previous-semester-marks-report.component';

describe('PreviousSemesterMarksReportComponent', () => {
  let component: PreviousSemesterMarksReportComponent;
  let fixture: ComponentFixture<PreviousSemesterMarksReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousSemesterMarksReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousSemesterMarksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
