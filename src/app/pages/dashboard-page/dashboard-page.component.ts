import { Component, OnInit } from '@angular/core';
import { StrongFBFormClass } from 'src/app/StrongFB/common/StrongFB-base';
import { DashboardPageForm } from 'src/app/StrongFB/forms/pages/dashboard-page.form';
import { StrongFBService } from 'src/app/StrongFB/services/StrongFB.service';

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  form: StrongFBFormClass;

  constructor(public strongfb: StrongFBService) { }


  async ngOnInit() {
    this.form = await this.strongfb.loadFormClass(DashboardPageForm);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.


  }

}
