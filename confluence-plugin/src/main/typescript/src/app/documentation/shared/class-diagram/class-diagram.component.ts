import {Component, OnInit, OnChanges, SimpleChanges, Input, ElementRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ParamsService} from '../../../params.service';
import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3';

@Component({
  moduleId: module.id,
  selector: 'app-class-diagram',
  templateUrl: 'class-diagram.component.html',
  styleUrls: ['class-diagram.component.css']
})
export class ClassDiagramComponent implements OnInit, OnChanges {

  @Input('data')
  private data: any;

  @ViewChild('svg')
  private svgElem: ElementRef;

  @ViewChild('g')
  private gElem: ElementRef;

  private dagreGraph: any;
  private svg: any;
  private inner: any;
  private render: any;

  private initialized: boolean = false;

  constructor(private router: Router, private paramsService: ParamsService) {
  }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.init();
      if (this.data) {
        this.generate();
      }
    }
  }

  private init() {
      this.dagreGraph = new dagreD3.graphlib.Graph();
      this.dagreGraph.setGraph({});
      this.svg = d3.select(this.svgElem.nativeElement);
      this.inner = d3.select(this.gElem.nativeElement);
  }

  private drawEntity(entity: any) {
    this.dagreGraph.setNode(entity.fullName, {
      data: {
        abstract: entity.abstract,
        static: entity.static,
        methods: entity.methods,
        name: entity.name,
        fullName: entity.fullName,
        fields: entity.fields,
        type: entity.type
      },
      label: "",
      width: entity.size.width,
      height: entity.size.height,
      shape: "class"
    });
  };

  private generate() {
    this.init();
    var data = this.data;

    for (var key in data.entities) {
      if (data.entities.hasOwnProperty(key)) {
        this.calculateEntityWidth(data.entities[key]);
        this.drawEntity(data.entities[key]);
      }
    }

    data.relations.forEach((relation: any) => {
      if (this.dagreGraph.nodes().indexOf(relation.source) === -1 || this.dagreGraph.nodes().indexOf(relation.target) === -1) {
        // prevent errors in case of invalid relationship
        return true;
      }

      var type = relation.type;
      this.dagreGraph.setEdge(relation.source, relation.target, {
        //lineInterpolate: "step-after",
        class: type,
        arrowhead: type
      });
    });

    var zoom = d3.behavior.zoom().on("zoom", () => {
      let event = d3.event as any;
      this.inner.attr("transform", "translate(" + event.translate + ")" +
        "scale(" + event.scale + ")");
    }).scaleExtent([0.1, 1]);
    this.svg.call(zoom);

    this.render = new dagreD3.render();

    this.render.arrows().aggregation = (parent: any, id: string) => {
      var marker = parent.append("marker")
        .attr("id", id)
        .attr("viewBox", "0 0 50 50")
        .attr("refX", 20)
        .attr("refY", 10)
        .attr("markerWidth", 20)
        .attr("markerHeight", 20)
        .attr("orient", "auto")
        .classed("aggregation", true);

      var polygon = marker.append("polygon")
        .attr("points", "0,10 10,5 20,10 10,15");
    };

    this.render.arrows().composition = (parent: any, id: string) => {
      var marker = parent.append("marker")
        .attr("id", id)
        .attr("viewBox", "0 0 50 50")
        .attr("refX", 20)
        .attr("refY", 10)
        .attr("markerWidth", 20)
        .attr("markerHeight", 20)
        .attr("orient", "auto")
        .classed("composition", true);

      var polygon = marker.append("polygon")
        .attr("points", "0,10 10,5 20,10 10,15");
    };

    this.render.arrows().association = (parent: any, id: string, edge: any, type: any) => {
    };

    this.render.arrows().dependency = (parent: any, id: string) => {
      var marker = parent.append("marker")
        .attr("id", id)
        .attr("viewBox", "0 0 50 50")
        .attr("refX", 20)
        .attr("refY", 10)
        .attr("markerWidth", 20)
        .attr("markerHeight", 20)
        .attr("orient", "auto")
        .classed("composition", true);

      var polygon = marker.append("polygon")
        .attr("points", "10,5 20,10 10,15 19.9999,10");
    };

    this.render.arrows().realization = (parent: any, id: string) => {
      var marker = parent.append("marker")
        .attr("id", id)
        .attr("viewBox", "0 0 50 50")
        .attr("refX", 20)
        .attr("refY", 10)
        .attr("markerWidth", 20)
        .attr("markerHeight", 20)
        .attr("orient", "auto")
        .classed("realization", true);

      var polygon = marker.append("polygon")
        .attr("points", "10,5 20,10 10,15");
    };

    this.render.arrows().generalization = (parent: any, id: string) => {
      var marker = parent.append("marker")
        .attr("id", id)
        .attr("viewBox", "0 0 50 50")
        .attr("refX", 20)
        .attr("refY", 10)
        .attr("markerWidth", 20)
        .attr("markerHeight", 20)
        .attr("orient", "auto")
        .classed("composition", true);

      var polygon = marker.append("polygon")
        .attr("points", "10,5 20,10 10,15");
    };

    this.render.shapes().class = (parent: any, bbox: any, node: any) => {
      var headerRows = 1;

      if (node.data.type == "interface") {
        headerRows++;
      }

      var rows = headerRows + node.data.methods.length + node.data.fields.length;


      var w = bbox.width,
        h = bbox.height;

      var h_row = 1 / rows * h;
      var h1 = headerRows * h_row;
      var h2 = (headerRows + node.data.fields.length) / rows * h;

      var g = parent.insert("g")
        .attr("x", -w / 2)
        .attr("y", -h / 2);

      var outerRect = g.append("rect")
        .attr("x", -w / 2)
        .attr("y", -h / 2)
        .attr("width", w)
        .attr("height", h)
        .attr("rx", 5)
        .attr("ry", 5)
        .classed("outer", true);

      var nameRect = g.append("rect")
        .attr("x", -w / 2)
        .attr("y", -h / 2)
        .attr("width", w)
        .attr("height", h1)
        .attr("rx", 5)
        .attr("ry", 5)
        .classed("head", true);

      var textOffset = {
        x: -w / 2 + 4,
        y: -h / 2 + h_row / 2 + 4
      };

      if (node.data.entityType != "class" && node.data.entityType != "enum") {

        if (node.data.type == "interface") {
          g.append("text")
            .classed("head", true)
            .attr("x", 0)
            .attr("y", textOffset.y)
            .attr("text-anchor", "middle")
            .text('«Interface»');
        }

        g.append("text")
          .classed("head", true)
          .attr("x", 0)
          .attr("y", textOffset.y)
          .attr("text-anchor", "middle")
          .text(node.data.name);
      } else {
        var headText = g.append("text")
          .classed("head", true)
          .attr("x", 0)
          .attr("y", textOffset.y)
          .attr("text-anchor", "middle")
          .text(node.data.name);
        if (node.data.abstract) {
          headText.classed("abstract", true);
        }
      }

      var i: number;

      if (node.data.fields && node.data.fields.length) {
        var fieldRect = g.append("rect")
          .attr("x", -w / 2)
          .attr("y", -h / 2 + h1)
          .attr("width", w)
          .attr("height", h2 - h1)
          .classed("fields", true);
        i = 0;
        node.data.fields.forEach((elem: any) => {
          var text = g.append("text");

          if (elem.scope == "PUBLIC") {
            text.append("tspan").text("\uf09c ").classed("scope public", true);
          } else if (elem.scope == "PRIVATE") {
            text.append("tspan").text("\uf023 ").classed("scope private", true);
          } else if (elem.scope == "PROTECTED") {
            text.append("tspan").text("\uf13e ").classed("scope protected", true);
          }

          var tspan = text
          //.classed("abstract",true)
          //.classed("static",true)
            .attr("x", textOffset.x)
            .attr("y", textOffset.y + h_row * i + h1)
            .append("tspan")
            .text(elem.string);

          if (elem.abstract) {
            tspan.classed("abstract", true);
          }

          if (elem.static) {
            tspan.classed("static", true);
          }

          i++;
        });
      }

      if (node.data.methods) {
        i = 0;
        node.data.methods.forEach((elem: any) => {
          var text = g.append("text");

          if (elem.scope == "PUBLIC") {
            text.append("tspan").text("\uf09c ").classed("scope public", true);
          } else if (elem.scope == "PRIVATE") {
            text.append("tspan").text("\uf023 ").classed("scope private", true);
          } else if (elem.scope == "PROTECTED") {
            text.append("tspan").text("\uf13e ").classed("scope protected", true);
          }

          var tspan = text
          //.classed("abstract",true)
          //.classed("static",true)
            .attr("x", textOffset.x)
            .attr("y", textOffset.y + h_row * i + h2)
            .append("tspan")
            .text(elem.string);

          if (elem.abstract) {
            tspan.classed("abstract", true);
          }
          if (elem.static) {
            tspan.classed("static", true);
          }


          i++;

        });

      }

      node.intersect = (point: any) => {
        return (dagreD3 as any).intersect.rect(node, point);
      };

      g.on("click", () => {
        if (!(d3.event as any).defaultPrevented && d3.event) {
          this.router.navigate(['/' + this.paramsService.getSourceUnitId() + '/omnidoc/' + node.data.fullName]);
        }
      });

      return outerRect;
    };

    this.render(this.inner, this.dagreGraph);

    var initialScale = Math.min(parseInt(this.svg.style("width")) / this.dagreGraph.graph().width, parseInt(this.svg.style("height")) / this.dagreGraph.graph().height) * 0.9;

    zoom
      .scale(initialScale)
      .translate([parseInt(this.svg.style("width")) / 2 - this.dagreGraph.graph().width * initialScale / 2, 20])
      .event(this.svg);
  };

  private calculateEntityWidth(entity: any) {
    var that = this;
    var getWidth = function (text: string) {
      if (text) {
        var width = 0;
        that.svg.select(".textSizer").text(text).each(function () {
          width = this.getBBox().width;
          return false;
        });
        return width;
      } else {
        return 0;
      }

    };

    var widest = 0;

    if (entity.fields) {
      entity.fields.forEach(function (elem: any) {
        var width = getWidth(elem.string);
        if (width > widest) {
          widest = width;
        }
      });
    }

    if (entity.methods) {
      entity.methods.forEach(function (elem: any) {
        var width = getWidth(elem.string);
        if (width > widest) {
          widest = width;
        }
      });
    }

    var width = getWidth(entity.name);
    if (width > widest) {
      widest = width;
    }

    var methods = entity.methods ? entity.methods.length : 0;
    var fields = entity.fields ? entity.fields.length : 0;

    var headerRows = 1;

    if (entity.type != "class") {
      headerRows++;
    }

    var verticalCount = (Math.max(methods, 1) + Math.max(fields, 1) + headerRows);

    entity.size = {
      width: Math.max(widest + 50, 200),
      height: verticalCount * 20
    };
  }

}
