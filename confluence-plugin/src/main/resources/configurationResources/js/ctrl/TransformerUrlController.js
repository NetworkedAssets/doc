angular.module("DoC_Config").controller("TransformerUrlController",function($http, urlService) {
    var tc = this;

    tc.get = function () {
        $http.get(urlService.getRestUrlWithParams("transformerUrl")).then(function (response) {
            var url = response.data;
            console.log(url);
            tc.url = url;
        })
    };

    tc.set = function () {
        $http.post(urlService.getRestUrlWithParams("transformerUrl"), tc.url)
    };

    tc.get();
});