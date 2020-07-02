import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallAttendanceReportComponent } from './overall-attendance-report.component';

describe('OverallAttendanceReportComponent', () => {
  let component: OverallAttendanceReportComponent;
  let fixture: ComponentFixture<OverallAttendanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverallAttendanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
