import {Component} from '@angular/core';
import {HtmlDocItemService} from '../shared/htmlDocItem.service';
import {Observable} from 'rxjs/Rx';
import {ActivatedRoute} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-markup-entity',
  templateUrl: 'markup-entity.component.html',
  styleUrls: ['markup-entity.component.css']
})
export class MarkupEntityComponent {

  loading = true;
  content = '';

  constructor(private htmlDocItemService: HtmlDocItemService, private route: ActivatedRoute) {

    Observable.zip(this.htmlDocItemService.onHtmlDocItemsReady()).subscribe(() => {
      this.update(this.route.snapshot.params['docItem']);
    });

    this.route.params.subscribe((params) => {
      this.update(params['docItem']);
    });
  }

  public update(id: number): void {
    this.loading = true;
    this.content = '';
    if (this.htmlDocItemService.isHtmlDocItemsReady()) {
      if (id) {
        setTimeout(() => {
          const htmlDocItems: Array<any> = this.htmlDocItemService.htmlDocItems.filter(item => item.id === +id);
          this.content = htmlDocItems.length > 0 ? htmlDocItems[0].content : '';
          this.loading = false;
        }, 50);
      } else {
        this.loading = false;
      }
    }
  }
}
