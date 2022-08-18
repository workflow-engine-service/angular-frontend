import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbMenuItem, NbMenuService, NbSidebarService } from '@nebular/theme';
import { filter } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { StrongFBHttpService } from 'src/app/StrongFB/services/StrongFB-http.service';
// import { StrongFBHttpService } from 'strong_form_builder/data/templates/services/StrongFB-http.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  page: 'dashboard' | 'workers' | 'admin_users' | 'admin_workflows' | 'admin_workflow_visualize';
  showLogo = true;
  userInfo: {
    id: number;
    name: string;
    is_admin: boolean;
    email?: string;
    roles: string[];
  };
  items: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'browser-outline',
      link: '/dashboard',
      data: {
        page: 'dashboard'
      }
    },
    {
      title: 'Workers',
      icon: 'clipboard-outline',
      link: '/workers',
      data: {
        page: 'workers'
      },
    },
    {
      title: 'Admin Area',
      icon: 'shield-outline',
      // hidden: true,
      data: {
        is_admin: true,
      },
      children: [
        {
          title: 'users',
          icon: 'people-outline',
          link: '/admin/users',
          data: {
            page: 'admin_users',
            is_admin: true,
          },
        },
        {
          title: 'workflows',
          icon: 'folder-outline',
          link: '/admin/workflow/list',
          data: {
            page: 'admin_workflows',
            is_admin: true,
          },
        },
      ]
    }
  ];



  profileItems: NbMenuItem[] = [
    {
      title: 'profile',
      hidden: true,
    },
    {
      title: 'Logout',
      data: { type: 'logout' }
    },


  ];


  constructor(
    private sidebarService: NbSidebarService,
    private _route: ActivatedRoute,
    private _http: StrongFBHttpService,
    private _menuService: NbMenuService
  ) { }

  async ngOnInit() {
    // =>get user info
    this.userInfo = (await this._http.get('/user/info'))?.result?.data;
    if (!this.userInfo) this._http.redirectLogin();
    console.log('user:', this.userInfo);
    // this._menuService.addItems([
    // ])

    this._menuService.onItemClick()
      .pipe(filter(({ tag }) => tag === 'profileItems'))
      .subscribe(bag => {
        console.log(bag)
        if (bag.item.data.type === 'logout') {
          this._http.resetTokens();
          this._http.redirectLogin();
        }
      });

    this._route.data.subscribe((it) => {
      if (!it) return;
      this.page = it['page'] as any;
      for (const item of this.items) {
        item.selected = false;
        if (item.data['is_admin']) {
          item.hidden = !this.userInfo?.is_admin;
        }
        if (item.data && item.data['page'] === this.page) {
          item.selected = true;
        }
      }
      // alert(this.page)
    });

  }

  toggle() {
    this.sidebarService.toggle(this.showLogo);
    this.showLogo = !this.showLogo;
    return false;
  }



}
