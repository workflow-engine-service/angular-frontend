import { Injectable } from '@angular/core';


declare var _global_configs_: object;


@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  static VERSION = '0.8';
  static UPDATE_STATE_INTERVAL = 1000;

  static ASSETS_BASE_URL = '/assets';
  static API_ENDPOINT =
    'http://192.168.31.178:8082/api/v1'//'http://localhost:8083/api/v1';
  static AUTH_HEADER_NAME = 'Authorization';
  static REQUEST_TIMEOUT = 30000;
  static ENABLE_DEBUG_LOGS = true;
  static AVAILABLE_LANGUAGES = ['fa'];
  constructor() { }

  static async load() {
    // =>update api endpoint
    // console.log(window.location.origin)
    // if (window.location.origin) {
    //   SettingsService.API_ENDPOINT = window.location.origin + '/api';
    //   // log('updated api endpoint:', SettingsService.API_ENDPOINT);
    // }
    // =>update settings variables with global configs
    try {
      if (_global_configs_) {
        for (const key of Object.keys(_global_configs_)) {
          if (SettingsService[key]) {
            SettingsService[key] = _global_configs_[key];
          }
        }
        // log('updated settings with global configs:', _global_configs_);
      }
    } catch (e) { }
  }
}
