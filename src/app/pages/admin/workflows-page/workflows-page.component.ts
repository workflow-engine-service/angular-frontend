import { Component, OnInit } from '@angular/core';
import { StrongFBFormClass } from 'src/app/StrongFB/common/StrongFB-base';
import { WorkflowsPageForm } from 'src/app/StrongFB/forms/pages/workflows-page.form';
import { StrongFBService } from 'src/app/StrongFB/services/StrongFB.service';

@Component({
  selector: 'admin-workflows-page',
  templateUrl: './workflows-page.component.html',
  styleUrls: ['./workflows-page.component.scss']
})
export class WorkflowsPageComponent implements OnInit {

  form: StrongFBFormClass;

  constructor(public strongfb: StrongFBService) { }


  async ngOnInit() {
    this.form = await this.strongfb.loadFormClass(WorkflowsPageForm);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.


  }

}
