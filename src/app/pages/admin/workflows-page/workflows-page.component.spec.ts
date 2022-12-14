import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowsPageComponent } from './workflows-page.component';

describe('WorkflowsPageComponent', () => {
  let component: WorkflowsPageComponent;
  let fixture: ComponentFixture<WorkflowsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
