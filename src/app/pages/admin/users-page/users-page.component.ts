import { Component, OnInit } from '@angular/core';
import { StrongFBFormClass } from 'src/app/StrongFB/common/StrongFB-base';
import { AdminUsersPageForm } from 'src/app/StrongFB/forms/pages/admin-users-page.form';
import { StrongFBService } from 'src/app/StrongFB/services/StrongFB.service';

@Component({
  selector: 'admin-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {


  form: StrongFBFormClass;

  constructor(public strongfb: StrongFBService) { }


  async ngOnInit() {
    this.form = await this.strongfb.loadFormClass(AdminUsersPageForm);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.


  }

}
