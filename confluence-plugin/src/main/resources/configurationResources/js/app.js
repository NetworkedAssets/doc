var doc_confluencePath = "";

if (AJS && AJS.Data) {
    doc_confluencePath = AJS.Data.get("base-url")+"/";
} else {
    var arr = window.location.pathname.split("/");
    arr.splice(arr.length-1,1);
    doc_confluencePath = window.location.origin+arr.join("/")+"/";
}

angular.module("DoC_Config",['ngResource']);

angular.module("DoC_Config").run(function($rootScope) {
    if (AJS && AJS.params && AJS.params.configLocation) {
        $rootScope.location = AJS.params.configLocation;
    } else {
        $rootScope.location = "local";
    }
});
angular.element(document).ready(function() {
    $("#doc_config-loading").spin("large");
    AJS.$("#doc_config .spin.small").spin("small");
    AJS.$("#doc_config .spin:not(.small)").spin();
});

angular.module("DoC_Config").config(function($httpProvider) {
    $httpProvider.interceptors.push(function() {
        return {
            request: function(config) {
                config.headers["X-Atlassian-Token"] = "nocheck";
                if (AJS &&
                    AJS.params &&
                    AJS.params.macroParamsJson &&
                    angular.fromJson(AJS.params.macroParamsJson).macroOwner
                ) {
                    config.headers["X-Macro-Owner"] = angular.fromJson(AJS.params.macroParamsJson).macroOwner;
                }
                return config;
            }
        };
    });
});