import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs/Rx';

declare var AJS: any;

@Injectable()
export class ParamsService {

  private params: any = {
    bundle: 1,
    macroOwner: '2c9682714db22c7c014db22f51970002',
    classDiagram: true,
    structureGraph: true,
    markup: true,
    omniDoc: true
  };

  private paramsChanged = new Subject<ParamsEvent>();

  constructor() {
    if (this.isInConfluence()) {
      this.params = JSON.parse(AJS.params.macroParamsJson);
    }
  }

  public getParam(key: string): any {
    return this.params[key];
  }

  public setParam(key: string, value: any): ParamsService {
    this.params[key] = value;
    this.paramsChanged.next({key: key, value: value});
    return this;
  }

  public getBundleId(): number {
    return +this.params['bundle'];
  }

  public onParamsChange(): Observable<ParamsEvent> {
    return this.paramsChanged;
  }

  public setSourceUnitId(id: number) {
    this.setParam('sourceUnitId', id);
    return this;
  }

  public getSourceUnitId(): number {
    return this.getParam('sourceUnitId');
  }

  public isInConfluence(): boolean {
    return AJS && AJS.Data;
  }
}

export interface ParamsEvent {
  key: string;
  value: any;
}
