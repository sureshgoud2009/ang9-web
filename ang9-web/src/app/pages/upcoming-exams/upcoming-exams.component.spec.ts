import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingExamsComponent } from './upcoming-exams.component';

describe('UpcomingExamsComponent', () => {
  let component: UpcomingExamsComponent;
  let fixture: ComponentFixture<UpcomingExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingExamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
