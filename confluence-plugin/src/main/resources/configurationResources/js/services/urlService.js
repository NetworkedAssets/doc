angular.module("DoC_Config").factory("urlService",function() {
    var urlService = {
        getRestUrl: function(path) {
            if (!path) {
                path = "";
            }
            return this.getBaseUrl()+"/rest/doc/1.0/configuration"+path;
        },
        getRestUrlWithParams: function() {
            var params = arguments;
            var paramString = "/";
            angular.forEach(params,function(param) {
                paramString += urlService.encodeComponent(param)+"/";
            });
            return this.getRestUrl(paramString);
        },
        getResourcesUrl: function(path) {
            if (!path) {
                path = "";
            }
            return this.getBaseUrl()+"/download/resources/com.networkedassets.autodoc.confluence-plugin:configuration-resources/configurationResources"+path;
        },
        isLocal: function() {
            return AJS.params && AJS.params.baseUrl;
        },
        getBaseUrl: function() {
            if (this.isLocal()) {
                return AJS.params.baseUrl;
            } else {
                return "http://atlassian-na-dev-01.networkedassets.local/confluence";
            }
        },
        encodeComponent: function(string) {
            return encodeURIComponent(encodeURIComponent(string));
        }
    };
    return urlService;
});