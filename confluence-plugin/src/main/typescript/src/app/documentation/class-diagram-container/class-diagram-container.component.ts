import {Component, OnInit} from '@angular/core';
import {UrlService} from '../../url.service';
import {ActivatedRoute} from '@angular/router';
import {Subject, Observable} from 'rxjs/Rx';
import {ParamsService} from '../../params.service';
import {CustomHttp} from '../../custom-http';

@Component({
  moduleId: module.id,
  selector: 'app-class-diagram-container',
  templateUrl: 'class-diagram-container.component.html',
  styleUrls: ['class-diagram-container.component.css']
})
export class ClassDiagramContainerComponent implements OnInit {

  private onInit = new Subject();

  private data: any;

  constructor(private http: CustomHttp, private urlService: UrlService, private route: ActivatedRoute,
              private paramsService: ParamsService) {
    Observable.zip(this.route.parent.params, this.onInit).subscribe(() => {
      this.getData();
    });
  }

  ngOnInit() {
    this.onInit.next();
  }

  getData() {
    this.http.get(this.urlService
      .getRestUrl('documentation', 'sourceUnit', this.paramsService.getSourceUnitId(), 'documentationType', 'class_diagram', 'docItem', 'all'))
      .subscribe((response) => {
        this.data = response.json().content;
      });
  }

}
