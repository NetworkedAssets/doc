import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Node} from '../shared/node';


@Component({
  moduleId: module.id,
  selector: 'app-tree-node',
  templateUrl: 'tree-node.component.html',
  styleUrls: ['tree-node.component.css']
})


export class TreeNodeComponent implements OnInit {

  @Input() node: Node;
  @Input() directoryIcon = false;
  @Input() index: number;
  @Output() clicked = new EventEmitter<Node>();

  constructor() {
  }

  ngOnInit() {

  }

  clickNodeExpand() {
    this.node.isExpanded = !this.node.isExpanded;
  }

  clickNodeName(node: Node) {
    this.clicked.emit(node);
  }

  propagate(node: Node) {
    this.clicked.emit(node);
  }

}
