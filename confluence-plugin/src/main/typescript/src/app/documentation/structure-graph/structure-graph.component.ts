import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OmniDocService} from '../omni-doc/shared/omnidoc.service';
import {Observable, Subject} from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'app-structure-graph',
  templateUrl: 'structure-graph.component.html',
  styleUrls: ['structure-graph.component.css']
})
export class StructureGraphComponent implements OnInit {

  private onInit = new Subject();
  nodes: Array<any>;

  constructor(private route: ActivatedRoute, private omnidocService: OmniDocService) {
    Observable.zip(this.route.parent.params, this.onInit).subscribe(() => {
      this.getNodes();
    });
  }

  ngOnInit() {
    this.onInit.next();
  }

  getNodes() {
    this.omnidocService.getSingleRootTree().subscribe(x => {
      this.nodes = x;
    });
  }
}
