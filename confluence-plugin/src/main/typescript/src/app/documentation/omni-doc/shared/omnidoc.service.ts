import {Injectable} from '@angular/core';
import {Response, URLSearchParams} from '@angular/http';
import {UrlService} from '../../../url.service';
import {Observable, Subject} from 'rxjs/Rx';
import {NotifyService} from '../../../notify.service';
import {ParamsService} from '../../../params.service';
import {CustomHttp} from '../../../custom-http';
import {Node} from '../tree-view/shared/node';

@Injectable()
export class OmniDocService {

  private names: Array<string>;

  private structureReadySubject = new Subject();
  private structureReady = false;

  constructor(private http: CustomHttp, private urlService: UrlService,
              private notifyService: NotifyService, private paramsService: ParamsService) {
  }

  getTreeStructure(): Observable <Array<any>> {
    return Observable.create((observer: any) => {
      this.http.get(
        this.urlService
          .getRestUrl('documentation', 'sourceUnit', this.paramsService.getSourceUnitId(), 'documentationType', 'omnidoc', 'tree'))
        .map(resp => resp.json().map((x: any) => new Node(x)))
        .catch((err: Response) => {
          if (err.status === 404) {
            this.notifyService.info('OmniDoc not found', 'Check if OmniDoc exists in selected source unit.');
            return Observable.throw(err);
          }
          this.notifyService.error('An error occurred', 'Try reloading the page.');
          return Observable.throw(err);
        }).subscribe((result) => {
        this.names = this.getAllFullNames(result);
        observer.next(result);
        observer.complete();
        this.structureReady = true;
        this.structureReadySubject.next();
      });
    });
  }

  getEntity(fullName: string) {
    return this.http.get(
      this.urlService
        .getSourceUnitRestUrl('omnidoc', 'docItem', fullName)
    ).map(resp => resp.json());
  }

  hasEntity(fullName: String): boolean {
    return this.names.some(x => x === fullName);
  }

  getOmidocSearch(params: string): Observable<any> {

    let searchParams = new URLSearchParams();
    searchParams.set('query', params);

    return this.http.get(this.urlService
      .getRestUrl('documentation', 'sourceUnit', this.paramsService.getSourceUnitId(), 'search'), {search: searchParams})
      .map(res => res.json());
  }

  getSingleRootTree(): Observable<any> {
    return this.http.get(
      this.urlService
        .getRestUrl('documentation', 'sourceUnit', this.paramsService.getSourceUnitId(), 'documentationType', 'omnidoc', 'singleRootTree'))
      .map(resp => resp.json())
      .catch((err: Response) => {
        if (err.status === 404) {
          this.notifyService.info('OmniDoc not found', 'Check if OmniDoc exists in selected source unit.');
          return Observable.throw(err);
        }
        this.notifyService.error('An error occurred', 'Try reloading the page.');
        return Observable.throw(err);
      });
  }

  onStructureReady(): Observable<any> {
    return this.structureReadySubject;
  };

  isStructureReady(): boolean {
    return this.structureReady;
  }

  private getAllFullNames(nodes: Array<Node>): Array<string> {
    let names: Array<string> = [];
    nodes.forEach((node: Node) => this.addFullNameToArray(node, names));
    return names;
  }

  private addFullNameToArray(node: any, names: Array<string>) {
    names.push(node.params.fullName);
    node.children.forEach((childNode: any) => this.addFullNameToArray(childNode, names));
  }
}




