import {Component, OnInit, OnChanges, SimpleChanges, Input, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {ParamsService} from '../../../../params.service';
import * as d3 from 'd3';
import {CapitalizePipe} from '../../../../capitalize.pipe';


@Component({
  moduleId: module.id,
  selector: 'app-structure-graph-renderer',
  templateUrl: 'structure-graph-renderer.component.html',
  styleUrls: ['structure-graph-renderer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StructureGraphRendererComponent implements OnInit, OnChanges {

  @Input('data') private data: any;

  isLoading = true;
  isError = false;
  isLoadingTakesLonger = false;
  private svg: any;
  private force: any;
  private link: any;
  private node: any;
  private alphaMax = 1;
  private alpha = 1;
  private alphaMin = .3;


  constructor(private router: Router, private paramsService: ParamsService) {

  }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (this.data) {
        this.generate();
      }
    }
  }


  private init() {
    const margin: any = {top: -5, right: -5, bottom: -5, left: -5};
    const width: any = window.innerWidth - margin.left - margin.right;
    const height: any = window.innerHeight - margin.top - margin.bottom;
    this.svg = d3.select('#doc_structureGraph').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);
    const g: any = this.svg.append('g');
    const zoom: any = d3.behavior.zoom().on('zoom', () => {
      let event = d3.event as any;
      g.attr('transform', 'translate(' + event.translate + ')' + 'scale(' + event.scale + ')');
    });
    this.svg.call(zoom);
    this.link = g.selectAll('.link');
    this.node = g.selectAll('.node').attr('cx', (d: any) => {
      return d.x;
    })
      .attr('cy', (d: any) => {
        return d.y;
      });
    this.force = d3.layout.force()
      .linkDistance(50)
      .charge(-1200)
      .gravity(0.5)
      .alpha(100)
      .size([width + margin.left + margin.right, height + margin.top + margin.bottom])
      .on('tick', () => this.tick());
  }

  public tick() {
    this.link
      .attr('x1', (d: any) => {
        return d.source.x;
      })
      .attr('y1', (d: any) => {
        return d.source.y;
      })
      .attr('x2', (d: any) => {
        return d.target.x;
      })
      .attr('y2', (d: any) => {
        return d.target.y;
      });

    this.node
      .attr('transform', (d: any) => {
        return 'translate(' + d.x + ',' + d.y + ')';
      });

  }

  private generate() {

    const rootLevel: number = this.data.fullName.split('.').length - 1;
    let nodes: any = this.flatten(this.data);
    let links: any = d3.layout.tree().links(nodes);
    this.force.nodes(nodes).links(links);
    this.updateLinks(links);
    this.updateNodes(nodes, rootLevel);
    setTimeout(this.draw(), 0);
    setTimeout(() => {
      if (this.isLoading) {
        this.isLoadingTakesLonger = true;
      }
    }, 5000);
  }

  private updateLinks(links: any) {
    this.link = this.link.data(links, (d: any) => {
      return d.target.id;
    });
    this.link.exit().remove();
    this.link.enter().insert('line', '.node')
      .attr('class', 'link');
  }


  private updateNodes(nodes: any, rootLevel: number) {
    this.node = this.node.data(nodes, (d: any) => {
      return d.id;
    });

    this.node.exit().remove();
    let nodeEnter: any = this.node.enter().append('g')
      .attr('class', (d: any) => {
        return this.cssClass(d);
      })
      .classed('node', true)
      .on('click', null)
      .on('click', (d: any) => this.click(d));

    nodeEnter.append('circle')
      .attr('r', (d: any) => {
        return 1 / (d.fullName.split('.').length - rootLevel) * 20 || 7;
      });

    nodeEnter.append('text')
      .classed('type', true)
      .attr('dy', '0.3em')
      .text((d: any) => {
        return d.type ? d.type.charAt(0).toUpperCase() : '';
      });

    nodeEnter.append('text')
      .attr('dy', '0.35em')
      .attr('dx', (d: any) => {
        return (1 / (d.fullName.split('.').length - rootLevel) * 20 * 0.1 + 0.35) + 'em';
      })
      .text((d: any) => {
        return d.name;
      });
  }

  private draw() {
    this.force.start();
    this.force.alpha(this.alpha);
    this.force.tick();
    this.alpha = this.force.alpha();
    this.force.stop();

    if (this.alpha >= this.alphaMin) {
      AJS.progressBars.update('#doc_structureGraphProgressbar', 1 - (this.alpha - this.alphaMin) / (this.alphaMax - this.alphaMin));
      setTimeout(this.draw(), 0);
    } else {
      setTimeout(() => {
        AJS.progressBars.update('#doc_structureGraphProgressbar', 1);
        this.isLoading = false;
        this.isLoadingTakesLonger = false;
        setTimeout(0);
      }, 10);
    }
  }


  private flatten(root: any) {
    let flatNodes: any = [];
    let i = 0;

    function recurse(node: any) {
      if (!node.id) {
        node.id = ++i;
      }
      if (node.children) {
        node.children.forEach((childNode: any) => recurse(childNode));
      }

      flatNodes.push(node);
    }

    recurse(root);
    return flatNodes;
  }


  private cssClass(d: any) {
    let cl: any = 'entityType' + new CapitalizePipe().transform(d.type);
    if (d._children) {
      cl += ' collapsed';
    } else if (d.children) {
      cl += ' expanded';
    }
    return cl;
  }


  private click(d: any) {
    const evt: any = <d3.ZoomEvent> d3.event;
    if (!evt.defaultPrevented) {
      if (typeof d.type === 'undefined' || d.type === 'package') {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        this.generate();
      } else {
        this.router.navigate(['/' + this.paramsService.getSourceUnitId() + '/omnidoc/' + d.fullName]);
      }
    }
  }
}
