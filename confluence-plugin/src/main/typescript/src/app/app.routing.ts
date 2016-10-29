import {RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {MainComponent} from './main/main.component';
import {OmniDocComponent} from './documentation/omni-doc/omni-doc.component';
import {MarkupComponent} from './documentation/markup/markup.component';
import {ClassDiagramContainerComponent} from './documentation/class-diagram-container/class-diagram-container.component';
import {StructureGraphComponent} from './documentation/structure-graph/structure-graph.component';
import {OmniDocEntityComponent} from './documentation/omni-doc/omni-doc-entity/omni-doc-entity.component';
import {MarkupEntityComponent} from './documentation/markup/markup-entity/markup-entity.component';

const appRoutes: any = [
  {
    path: ':sourceUnitId',
    component: MainComponent,
    children: [{
      path: 'omnidoc',
      component: OmniDocComponent,
      displayName: 'Omnidoc',
      children: [
        {
          path: '',
          component: OmniDocEntityComponent
        },
        {
          path: ':docItem',
          component: OmniDocEntityComponent
        }
      ],
      macroParam: 'omniDoc'
    }, {
      path: 'class-diagram',
      component: ClassDiagramContainerComponent,
      displayName: 'Class Diagram',
      macroParam: 'classDiagram'
    }, {
      path: 'markup',
      component: MarkupComponent,
      displayName: 'Markup',
      children: [
        {
          path: '',
          component: MarkupEntityComponent
        },
        {
          path: ':docItem',
          component: MarkupEntityComponent
        }
      ],
      macroParam: 'markup'
    }, {
      path: 'structure-graph',
      component: StructureGraphComponent,
      displayName: 'Structure graph',
      macroParam: 'structureGraph'
    }],
    containsDocTypes: true
  },
  {
    path: '',
    component: MainComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});
