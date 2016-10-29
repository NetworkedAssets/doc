'use strict';

// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
  'd3': 'vendor/d3/d3.min.js',
  'dagre-d3': 'vendor/dagre-d3/dist/dagre-d3.min.js',
  'dagre': 'vendor/dagre-d3/dist/dagre.min.js',
  'class-transformer': 'vendor/ClassTransformer.js',
  'ng2-bootstrap': 'vendor/ng2-bootstrap',
  'ng2-auto-complete': 'vendor/ng2-auto-complete',
  'moment': 'vendor/moment/moment.js',
};

/** User packages configuration. */
const packages: any = {

  // without this  error traceur is not found
  '@angular/core': {main: 'bundles/core.umd.js'},
  '@angular/common': {main: 'bundles/common.umd.js'},
  '@angular/compiler': {main: 'bundles/compiler.umd.js'},
  '@angular/forms': {main: 'bundles/forms.umd.js'},
  '@angular/http': {main: 'bundles/http.umd.js'},
  '@angular/platform-browser': {main: 'bundles/platform-browser.umd.js'},
  '@angular/platform-browser-dynamic': {main: 'bundles/platform-browser-dynamic.umd.js'},
  '@angular/router': {main: 'bundles/router.umd.js'},
  'vendor/ng2-bootstrap': {defaultExtension: 'js'},
  'ng2-auto-complete': {main: 'ng2-auto-complete.umd.js', defaultExtension: 'js'},


  'd3': {
    format: 'global'
  },
  'dagre-d3': {
    format: 'cjs'
  },
  'dagre': {
    format: 'cjs'
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/forms',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  'app/main-component',
  'app/main',
  'app/documentation/omni-doc',
  'app/documentation/markup',
  'app/documentation/class-diagram',
  'app/documentation/omni-doc/tree-view',
  'app/documentation/omni-doc/tree-view/tree-node',
  'app/documentation/class-diagram-container',
  'app/class-diagram',
  'app/documentation/structure-graph',
  'app/documentation/structure-graph/shared/structure-graph-renderer',
  'app/documentation/omni-doc/search-box',
  'app/documentation/omni-doc/omni-doc-entity',
  'app/documentation/markup/markup-entity',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = {main: 'index'};
});

/** Type declaration for ambient System. */
declare var System: any;
declare var AJS: any;

// Change SystemJS's base-url when running on Confluence
if (typeof AJS !== 'undefined' && AJS.Data) {
  System.config({
    baseURL: AJS.Data.get('base-url') + '/rest/doc/1.0/frontend'
  });
}

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js',
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({map, packages});
