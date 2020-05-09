import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassAttendanceDetailComponent } from './class-attendance-detail.component';

describe('ClassAttendanceDetailComponent', () => {
  let component: ClassAttendanceDetailComponent;
  let fixture: ComponentFixture<ClassAttendanceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassAttendanceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassAttendanceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
