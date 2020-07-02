import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSemesterMarksReportComponent } from './current-semester-marks-report.component';

describe('CurrentSemesterMarksReportComponent', () => {
  let component: CurrentSemesterMarksReportComponent;
  let fixture: ComponentFixture<CurrentSemesterMarksReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentSemesterMarksReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSemesterMarksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
