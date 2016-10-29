import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OmniDocService} from '../shared/omnidoc.service';
import {CustomHttp} from '../../../custom-http';
import {UrlService} from '../../../url.service';
import {ParamsService} from '../../../params.service';
import {Observable} from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'app-omni-doc-entity',
  templateUrl: 'omni-doc-entity.component.html',
  styleUrls: ['omni-doc-entity.component.css']
})
export class OmniDocEntityComponent {

  private loading: boolean = true;

  private entity: any; // TODO create type, when OmniDoc format is ready

  private classDiagram = {
    enabled: false,
    expanded: false,
    data: null as any
  };

  constructor(private route: ActivatedRoute,
              private omniDocService: OmniDocService,
              private http: CustomHttp,
              private urlService: UrlService,
              private paramsService: ParamsService) {

    Observable.zip(this.omniDocService.onStructureReady()).subscribe(() => {
      this.update(this.route.snapshot.params['docItem']);
    });

    this.route.params.subscribe((params) => {
      this.update(params['docItem']);
    });

    this.classDiagram.enabled = !!this.paramsService.getParam('classDiagram');
  }

  public resolvePath(path: string): string {
    return this.urlService.getResourcesUrl(path);
  }

  public update(fullName: string): void {
    if (this.omniDocService.isStructureReady()) {
      if (fullName) {
        this.loading = true;
        this.omniDocService.getEntity(fullName).subscribe(entity => {
          this.entity = entity;
          this.loading = false;
          if (this.classDiagram.enabled) {
            this.http.get(this.urlService
              .getRestUrl('documentation', 'sourceUnit', this.paramsService.getSourceUnitId(), 'documentationType', 'class_diagram', 'docItem', this.entity.fullName))
              .subscribe((response) => {
                this.classDiagram.data = response.json().content;
              });
            /* todo move to a service */
          }

        });
      } else {
        this.loading = false;
        this.entity = null as any;
      }
    }
  }

}
