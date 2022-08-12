import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDiagramPageComponent } from './workflow-diagram-page.component';

describe('WorkflowDiagramPageComponent', () => {
  let component: WorkflowDiagramPageComponent;
  let fixture: ComponentFixture<WorkflowDiagramPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowDiagramPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDiagramPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
