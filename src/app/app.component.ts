import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { StrongFBHttpService } from './StrongFB/services/StrongFB-http.service';
import { StrongFBService } from './StrongFB/services/StrongFB.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('serviceRef', { read: ViewContainerRef }) ServiceRef: ViewContainerRef;

  constructor(private themeService: NbThemeService, public http: StrongFBHttpService, private srv: StrongFBService) {
    this.http.configs({
      apiEndpoint: 'http://localhost:8082/api/v1',
      authenticationHeaderName: 'Authorization',
      getRefreshTokenApi: async (_http) => {
        return {
          access_token: '',
          refresh_token: '',
        }
      },
      refreshTokenKey: 'refresh_token',
      tokenKey: 'access_token',
      updateInterval: 1000,
      loginPath: '/login',
    });
    // this.themeService.changeTheme('dark');
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    let ref = setInterval(() => {
      if (!this.ServiceRef) return;
      this.srv.config({
        _viewContainerRef: this.ServiceRef,
      });
      clearInterval(ref);
    }, 20);
  }
}
