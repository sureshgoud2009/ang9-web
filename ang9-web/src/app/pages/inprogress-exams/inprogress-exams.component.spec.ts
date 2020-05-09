import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InprogressExamsComponent } from './inprogress-exams.component';

describe('InprogressExamsComponent', () => {
  let component: InprogressExamsComponent;
  let fixture: ComponentFixture<InprogressExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InprogressExamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InprogressExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
