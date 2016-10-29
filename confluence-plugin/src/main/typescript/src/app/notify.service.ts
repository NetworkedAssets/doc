import {Injectable} from '@angular/core';


@Injectable()
export class NotifyService {

  error(title: string, message: string) {
    AJS.flag({
      type: 'error',
      title: title,
      body: '<p>' + message + '</p>'
    });
  }

  info(title: string, message: string) {
    AJS.flag({
      type: 'info',
      title: title,
      body: '<p>' + message + '</p>'
    });
  }

  success(title: string, message: string) {
    AJS.flag({
      type: 'success',
      title: title,
      body: '<p>' + message + '</p>'
    });
  }

}
