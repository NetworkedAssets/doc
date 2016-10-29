import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {OmniDocService} from '../shared/omnidoc.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {ParamsService} from '../../../params.service';

@Component({
  moduleId: module.id,
  selector: 'app-search-box',
  templateUrl: 'search-box.component.html',
  styleUrls: ['search-box.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchBoxComponent implements OnInit {

  autoCompleteSearchTerm: string = '';
  typeaheadLoading: boolean = false;
  typeaheadNoResults: boolean = false;
  dataSource: Observable<any>;


  constructor(private omnidocService: OmniDocService, private router: Router, private paramsService: ParamsService) {
    this.dataSource = Observable.create((observer: any) => {
      observer.next(this.autoCompleteSearchTerm);
    }).mergeMap((token: string) => this.omnidocService.getOmidocSearch(token));

  }

  ngOnInit() {
  }

  public changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  public changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  public typeaheadOnSelect(e: any) {
    if (e.item.documentationType.toLowerCase() === 'html') {
      this.router.navigate(['/' + this.paramsService.getSourceUnitId() + '/' + 'markup' + '/' + e.item.id]);
    } else {
      this.router.navigate(['/' + this.paramsService.getSourceUnitId() + '/' + e.item.documentationType.toLowerCase() + '/' + e.item.fullName]);
    }
  }
}
