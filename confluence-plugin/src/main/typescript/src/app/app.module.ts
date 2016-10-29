import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {appRoutingProviders, routing} from './app.routing';
import {MainComponent} from './main/main.component';
import {ParamsService} from './params.service';
import {UrlService} from './url.service';
import {HttpModule, Http} from '@angular/http';
import {OmniDocComponent} from './documentation/omni-doc/omni-doc.component';
import {ClassDiagramContainerComponent} from './documentation/class-diagram-container/class-diagram-container.component';
import {MarkupComponent} from './documentation/markup/markup.component';
import {ClassDiagramComponent} from './documentation/shared/class-diagram/class-diagram.component';
import {CustomHttp} from './custom-http';
import {NotifyService} from './notify.service';
import {TreeViewComponent} from './documentation/omni-doc/tree-view/tree-view.component';
import {TreeNodeComponent} from './documentation/omni-doc/tree-view/tree-node/tree-node.component';
import {CapitalizePipe} from './capitalize.pipe';
import {ReplaceCharPipe} from './replace-char.pipe';
import {HtmlDocItemService} from './documentation/markup/shared/htmlDocItem.service';
import {OmniDocService} from './documentation/omni-doc/shared/omnidoc.service';
import {OmniDocEntityComponent} from './documentation/omni-doc/omni-doc-entity/omni-doc-entity.component';
import {OmniDocTagPipe} from './documentation/omni-doc/omni-doc-tag.pipe';
import {StructureGraphComponent} from './documentation/structure-graph/structure-graph.component';
import {StructureGraphRendererComponent} from './documentation/structure-graph/shared/structure-graph-renderer/structure-graph-renderer.component';
import {SearchBoxComponent} from './documentation/omni-doc/search-box/search-box.component';
import {TypeaheadModule} from 'ng2-bootstrap/ng2-bootstrap';
import {MarkupEntityComponent} from './documentation/markup/markup-entity/markup-entity.component';


@NgModule({
  declarations: [AppComponent, MainComponent, OmniDocComponent, OmniDocEntityComponent, ClassDiagramComponent, MarkupComponent,
    ClassDiagramContainerComponent, ReplaceCharPipe, TreeViewComponent,
    TreeNodeComponent, CapitalizePipe, StructureGraphComponent, StructureGraphRendererComponent, OmniDocTagPipe,
    SearchBoxComponent, MarkupEntityComponent],
  imports: [BrowserModule, HttpModule, FormsModule, routing, TypeaheadModule],
  bootstrap: [AppComponent],
  providers: [appRoutingProviders, ParamsService, UrlService, HtmlDocItemService, OmniDocService, NotifyService, {
    provide: CustomHttp,
    useClass: CustomHttp,
    deps: [Http, ParamsService]
  }]

})
export class AppModule {

}
