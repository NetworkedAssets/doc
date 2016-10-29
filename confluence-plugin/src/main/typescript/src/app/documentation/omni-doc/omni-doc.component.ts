import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, Observable} from 'rxjs/Rx';
import {OmniDocService} from './shared/omnidoc.service';
import {ParamsService} from '../../params.service';

@Component({
  moduleId: module.id,
  selector: 'app-omni-doc',
  templateUrl: 'omni-doc.component.html',
  styleUrls: ['omni-doc.component.css']
})
export class OmniDocComponent implements OnInit {

  private onInit = new Subject();
  treeStructure: Array<any>;

  constructor(private route: ActivatedRoute, private omnidocService: OmniDocService, private router: Router, private paramsService: ParamsService) {
    Observable.zip(this.route.parent.params, this.onInit).subscribe(() => {
      this.route.parent.params.subscribe(() => {
        this.getTreeStructure();
      });
    });
  }

  ngOnInit() {
    this.onInit.next();
  }


  displayContent(node: any) {
    this.router.navigate([this.paramsService.getBundleId(), 'omnidoc', node.params.fullName]);
  }

  getTreeStructure() {
    this.omnidocService.getTreeStructure().subscribe(x => {
      this.treeStructure = x;
    });
  }
}
