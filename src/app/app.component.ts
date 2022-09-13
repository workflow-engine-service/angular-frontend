import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { NbDirectionality, NbLayoutDirection, NbLayoutDirectionService, NbThemeService } from '@nebular/theme';
import { Common } from './locales/fa/common';
import { LANG as login_LANG } from './locales/fa/login';
import { Workers_Lang } from './locales/fa/workers';
import { SettingsService } from './services/settings.service';
import { AvailableLanguage } from './StrongFB/common/StrongFB-types';
import { StrongFBHttpService } from './StrongFB/services/StrongFB-http.service';
import { StrongFBService } from './StrongFB/services/StrongFB.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  bootLoading = true;
  configsLoaded = false;
  selectedLanguage: AvailableLanguage = 'en';
  version = SettingsService.VERSION;
  @ViewChild('serviceRef', { read: ViewContainerRef }) ServiceRef: ViewContainerRef;

  constructor(private themeService: NbThemeService, public http: StrongFBHttpService, private srv: StrongFBService, private dirService: NbLayoutDirectionService) {
    SettingsService.load();
    // this.themeService.changeTheme('dark');
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // =>remove boot loader
    document.getElementById('_boot_global_loading_').style.display = 'none';
    this.bootLoading = false;
    if (this.srv.locale().getLocalStorageLang()) {
      this.selectedLanguage = this.srv.locale().getLocalStorageLang();
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    let ref = setInterval(async () => {
      if (!this.ServiceRef) return;
      this.loadConfigs();
      // alert(await this.srv.locale().__('login', 'username'))

      clearInterval(ref);
    }, 20);
  }

  changeLanguage() {
    this.configsLoaded = false;
    this.srv.locale().setLang(this.selectedLanguage);
    this.dirService.setDirection(this.srv.locale().direction.getValue() === 'rtl' ? NbLayoutDirection.RTL : NbLayoutDirection.LTR);
    this.configsLoaded = true;
  }

  loadConfigs() {
    this.configsLoaded = false;
    setTimeout(() => {
      this.srv.config({
        viewContainerRef: this.ServiceRef,
        authenticationHeaderName: SettingsService.AUTH_HEADER_NAME,
        apiEndPoint: SettingsService.API_ENDPOINT,
        language: this.selectedLanguage,
        customLocales: {
          fa: {
            'login': login_LANG,
            'common': Common,
            'workers': Workers_Lang,
          }
        },
        darkTheme: true,
      });
      setTimeout(() => {
        this.srv.locale().setLang(this.selectedLanguage);
      }, 500);
      this.configsLoaded = true;
    }, 20);

  }
}
