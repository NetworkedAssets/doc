import {Injectable, Inject} from '@angular/core';
import {ParamsService} from './params.service';

declare var AJS: any;

@Injectable()
export class UrlService {

  constructor(@Inject(ParamsService) private paramsService: ParamsService) {
  }

  public getBundleRestUrl(...args: (string|number)[]) {
    return this.getBaseUrl() + '/bundles/' + this.paramsService.getBundleId() + this.parseArgs(args);
  }

  public getSourceUnitRestUrl(...args: (string|number)[]) {
    return this.getBaseUrl() + '/documentation/sourceUnit/' + this.paramsService.getSourceUnitId() + '/documentationType' + this.parseArgs(args);
  }

  public getRestUrl(...args: (string|number)[]): string {
    return this.getBaseUrl() + this.parseArgs(args);
  }

  public getBaseUrl(): string {
    if (AJS && AJS.Data) {
      return AJS.Data.get('base-url') + '/rest/doc/1.0/transformer';
    } else {
      return 'http://localhost:8080/transformer/rest';
    }
  }

  public getResourcesUrl(path: string): string {
    if (!path) {
      path = '';
    }
    if (AJS && AJS.Data) {
      return AJS.Data.get('base-url') + '/rest/doc/1.0/frontend/' + path;
    } else {
      return path;
    }
  }

  private parseArgs(args: (string|number)[]) {
    return ((args && args.length) ? ('/' + args.map((arg) => {
      if (arg) {
        return encodeURI(arg.toString());
      } else {
        return '';
      }
    }).join('/')) : '');
  }

}
