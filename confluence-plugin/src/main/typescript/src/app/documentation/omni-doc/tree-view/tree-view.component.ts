import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {Node} from './shared/node';


@Component({
  moduleId: module.id,
  selector: 'app-tree-view',
  templateUrl: 'tree-view.component.html',
  styleUrls: ['tree-view.component.css']
})
export class TreeViewComponent implements OnInit, OnChanges {

  @Input() treeNode: Array<Node>;
  @Input() directoryIcon = false;
  @Input() filter = false;
  @Input() expandCollapseButton = false;
  @Output() onChange = new EventEmitter<Node>();
  currentFocusNode: Node;
  query = '';

  private loading = true;

  constructor() {

  }

  ngOnInit() {
    this.currentFocusNode = null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['treeNode']) {
      this.loading = !this.treeNode;
    }
  }

  nodeClicked(nextNode: Node) {
    this.updateFocusNode(nextNode);
    this.onChange.emit(nextNode);
  }

  filterChange(query: string) {
    this.treeNode.forEach((node: Node) => node.filter(query));
  }

  expandAll() {
    this.treeNode.forEach((node: Node) => node.expand(true));
  }

  collapseAll() {
    this.treeNode.forEach((node: Node) => node.expand(false));
  }


  private updateFocusNode(next: Node) {
    if (this.currentFocusNode) {
      this.currentFocusNode.focus = false;
    }
    this.currentFocusNode = next;
    this.currentFocusNode.focus = true;
  }

}
