import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {UrlService} from '../url.service';
import {ParamsService} from '../params.service';
import {SourceUnit} from '../source-unit';
import {CustomHttp} from '../custom-http';

declare var AJS: any;

@Component({
  moduleId: module.id,
  selector: 'app-main',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.css']
})
export class MainComponent implements OnInit {

  private availableSourceUnits: SourceUnit[];
  private currentSourceUnitId: number;
  private docTypes: any[];
  private currentDocType: string;

  @ViewChild('sourceUnitSelect')
  private sourceUnitSelect: ElementRef;

  @ViewChild('docTypeSelect')
  private docTypeSelect: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router, private http: CustomHttp, private urlService: UrlService, private paramsService: ParamsService) {
  }

  ngOnInit() {
    this.router.config.forEach((obj: any) => {
      if (obj.containsDocTypes) {
        this.docTypes = obj.children.map((x: any) => {
          return {
            name: x.displayName,
            docType: x.path,
            macroParam: x.macroParam
          };
        }).filter((x: any) => {
          let param = this.paramsService.getParam(x.macroParam);
          return param !== "false" && param;
        });
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateCurrentDocType();
      }
    });

    let request = this.http.get(this.urlService.getBundleRestUrl());
    request.subscribe((response) => {
      this.availableSourceUnits = response.json()
        .sourceUnits.map((x: any) => SourceUnit.fromObject(x));
    });
    this.route.params.subscribe((params: any) => {
      if (params.sourceUnitId) {
        this.currentSourceUnitId = +params.sourceUnitId;
        this.paramsService.setSourceUnitId(+params.sourceUnitId);
      }
    });

    Observable.zip(request, this.http.get(this.urlService.getBundleRestUrl()), this.route.params).subscribe(() => {
      if (!this.currentSourceUnitId) {
        this.router.navigate(['/' + this.availableSourceUnits[0].id + '/' + this.docTypes[0].docType]);
      } else {
        this.updateCurrentDocType();

        AJS.$(this.sourceUnitSelect.nativeElement).auiSelect2({
          minimumResultsForSearch: 8
        }).change((event: any) => {
          this.router.navigate(['/' + event.val + '/' + this.currentDocType]);
        });

        AJS.$(this.docTypeSelect.nativeElement).auiSelect2({
          minimumResultsForSearch: Infinity
        }).change((event: any) => {
          this.router.navigate(['/' + this.currentSourceUnitId + '/' + event.val]);
        });
      }
    });
  }

  private updateCurrentDocType() {
    let matches = this.router.routerState.snapshot.url.match('/[^/]+/([^/]+)');
    if (matches) {
      this.currentDocType = matches[1];
    }
  }
}
