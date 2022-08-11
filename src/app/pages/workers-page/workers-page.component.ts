import { Component, OnInit } from '@angular/core';
import { StrongFBFormClass } from 'src/app/StrongFB/common/StrongFB-base';
import { WorkersPageForm } from 'src/app/StrongFB/forms/workers-page.form';
import { StrongFBService } from 'src/app/StrongFB/services/StrongFB.service';

@Component({
  selector: 'workers-page',
  templateUrl: './workers-page.component.html',
  styleUrls: ['./workers-page.component.scss']
})
export class WorkersPageComponent implements OnInit {

  form: StrongFBFormClass;

  constructor(public strongfb: StrongFBService) { }


  async ngOnInit() {
    this.form = await this.strongfb.loadFormClass(WorkersPageForm);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.


  }
}
