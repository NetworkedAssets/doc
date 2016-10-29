import {Component, OnInit} from '@angular/core';
import {HtmlDocItem} from './htmlDocItem/htmlDocItem';
import {ActivatedRoute, Router} from '@angular/router';
import {HtmlDocItemService} from './shared/htmlDocItem.service';
import {Observable, Subject} from 'rxjs/Rx';
import {Node} from '../omni-doc/tree-view/shared/node';
import {ParamsService} from '../../params.service';

@Component({
  moduleId: module.id,
  selector: 'app-markup',
  templateUrl: 'markup.component.html',
  styleUrls: ['markup.component.css']
})


export class MarkupComponent implements OnInit {

  treeStructure: Array<Node>;
  private onInit = new Subject();
  private root = 'root\\';


  constructor(private route: ActivatedRoute,
              private htmlDocItemService: HtmlDocItemService,
              private paramsService: ParamsService,
              private router: Router) {
    Observable.zip(this.route.parent.params, this.onInit).subscribe(() => {
      this.getData();
    });
  }

  ngOnInit() {
    this.onInit.next();
  }

  displayContent(node: any) {
    //console.log('node', node);
    if (!node.isRoot) {
      this.router.navigate([this.paramsService.getBundleId(), 'markup', node.params.id]);
    }
  }


  private getData() {
    this.htmlDocItemService.getHtmlDocItems().subscribe(x => {
      x.sort((item1: HtmlDocItem, item2: HtmlDocItem) => {
        if (item1.id > item2.id) {
          return 1;
        }
        if (item1.id < item2.id) {
          return -1;
        }
        return 0;
      });
      this.treeStructure = this.buildTreeStructure(x);
      //console.log('treeStructure', this.treeStructure);
    });
  }


  private buildTreeStructure(htmlDocItems: Array<HtmlDocItem>): Array<Node> {
    let data: Array<string> = [];
    for (let i = 0; i < htmlDocItems.length; i++) {
      this.buildTree(this.root.concat(htmlDocItems[i].originalPath).split('\\'), htmlDocItems[i].id, data);
    }
    return data.map((node: any) => new Node(node));
  }

  private buildTree(parts: string [], partsId: number, treeNode: any[]) {
    if (parts.length === 0) {
      return;
    }
    for (let i = 0; i < treeNode.length; i++) {
      if (parts[0] === treeNode[i].name) {
        this.buildTree(parts.splice(1, parts.length), partsId, treeNode[i].children);
        return;
      }
    }
    let children: Array<any> = [];
    let newNode = {'name': parts[0], 'id': partsId, 'children': children};
    treeNode.push(newNode);
    this.buildTree(parts.splice(1, parts.length), partsId, newNode.children);
  }


}
