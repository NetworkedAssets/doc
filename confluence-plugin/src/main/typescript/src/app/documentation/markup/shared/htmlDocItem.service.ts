import {Injectable} from '@angular/core';
import {HtmlDocItem} from '../htmlDocItem/htmlDocItem';
import {Response} from '@angular/http';
import {UrlService} from '../../../url.service';
import {Observable, Subject} from 'rxjs/Rx';
import {NotifyService} from '../../../notify.service';
import {ParamsService} from '../../../params.service';
import {CustomHttp} from '../../../custom-http';

@Injectable()
export class HtmlDocItemService {


  htmlDocItems: Array<HtmlDocItem>;
  private htmlDocItemsReady = false;
  private htmlDocItemsSubject = new Subject();


  constructor(private http: CustomHttp, private urlService: UrlService,
              private notifyService: NotifyService, private paramsService: ParamsService) {
  }


  getHtmlDocItems(): Observable<Array<HtmlDocItem>> {
    return Observable.create((observer: any) => {
      this.http.get(
        this.urlService.getRestUrl('documentation', 'sourceUnit', this.paramsService.getSourceUnitId(),
          'documentationType', 'html')).map(resp => resp.json().docItems.map((x: any) => HtmlDocItem.fromObject(x)))
        .catch((err: Response) => {
          if (err.status === 404) {
            this.notifyService.info('Markup not found', 'Check if markup exists in selected source unit.');
            return Observable.throw(err);
          }
          this.notifyService.error('An error occurred', 'Try reloading the page.');
          return Observable.throw(err);
        }).subscribe((result) => {
        this.htmlDocItems = result;
        observer.next(result);
        observer.complete();
        this.htmlDocItemsReady = true;
        this.htmlDocItemsSubject.next();
      });
    });

  }


  onHtmlDocItemsReady(): Observable<any> {
    return this.htmlDocItemsSubject;
  };

  isHtmlDocItemsReady(): boolean {
    return this.htmlDocItemsReady;
  }


}
