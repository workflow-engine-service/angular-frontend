import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  page: 'dashboard' | 'workers';
  showLogo = true;
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
  ];



  constructor(
    private sidebarService: NbSidebarService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._route.data.subscribe((it) => {
      if (!it) return;
      this.page = it['page'] as any;
      for (const item of this.items) {
        item.selected = false;
        if (item.data && item.data['page'] === this.page) {
          item.selected = true;
        }
      }
      // alert(this.page)
    })
  }

  toggle() {
    this.sidebarService.toggle(this.showLogo);
    this.showLogo = !this.showLogo;
    return false;
  }

}
