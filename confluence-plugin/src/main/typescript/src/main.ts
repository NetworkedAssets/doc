import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './app/';
import {AppModule} from './app/app.module';

if (environment.production) {
  enableProdMode();
}

if (typeof AJS !== 'undefined' && AJS.Data) {
  AJS.$("#editPageLink").off('click');
}

platformBrowserDynamic().bootstrapModule(AppModule);
