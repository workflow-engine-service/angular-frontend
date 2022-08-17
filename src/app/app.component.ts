import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { SettingsService } from './services/settings.service';
import { StrongFBHttpService } from './StrongFB/services/StrongFB-http.service';
import { StrongFBService } from './StrongFB/services/StrongFB.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  bootLoading = true;
  version = SettingsService.VERSION;
  @ViewChild('serviceRef', { read: ViewContainerRef }) ServiceRef: ViewContainerRef;

  constructor(private themeService: NbThemeService, public http: StrongFBHttpService, private srv: StrongFBService) {
    SettingsService.load();
    this.http.configs({
      apiEndpoint: SettingsService.API_ENDPOINT,
      authenticationHeaderName: SettingsService.AUTH_HEADER_NAME,
      getRefreshTokenApi: async (_http) => {
        return {
          access_token: '',
          refresh_token: '',
        }
      },
      refreshTokenKey: 'refresh_token',
      tokenKey: 'access_token',
      updateInterval: SettingsService.UPDATE_STATE_INTERVAL,
      loginPath: '/login',
    });
    // this.themeService.changeTheme('dark');
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // =>remove boot loader
    document.getElementById('_boot_global_loading_').style.display = 'none';
    this.bootLoading = false;
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
