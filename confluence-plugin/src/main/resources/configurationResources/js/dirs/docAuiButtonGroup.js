angular.module("DoC_Config").directive("docAuiButtonGroup",function() {
    return {
        require: "ngModel",
        scope: {
            options: "=docOptions"
        },
        link: function(scope,element,attrs,ngModel) {
            var type = attrs.docType;
            if (type !== "checkbox" && type !== "radio") {
                type = "radio";
            }

            var initModelIfNotObject = function() {
                if (typeof ngModel.$viewValue !== "object") {
                    var obj = {};
                    angular.forEach(scope.options,function(value,key) {
                        obj[key] = false;
                    });
                    ngModel.$setViewValue(obj);
                }
            };

            var updateView = function() {
                var btn;
                if (type === "radio") {

                    btn = $(element).find("button[data-value='"+ngModel.$viewValue+"']");
                    element.find("button").removeClass("aui-button-primary");
                    btn.addClass("aui-button-primary");

                } else {
                    btn = $(element).find("button");
                    btn.each(function() {
                        $(this).toggleClass("aui-button-primary",ngModel.$viewValue[$(this).data("value")]);
                    });

                }
            };

            var renderView = function(options) {
                angular.forEach(options,function(value) {
                    var btn = $('<button class="aui-button" data-value="'+value.value+'">'+value.label+'</button>').click(function() {
                        //$(this).toggleClass("aui-button-primary");
                        if (type==="radio") {
                            ngModel.$viewValue = $(this).data("value");
                        } else {
                            initModelIfNotObject();
                            ngModel.$viewValue[$(this).data("value")] = !ngModel.$viewValue[$(this).data("value")];
                        }
                        ngModel.$render();
                    });
                    btn.appendTo(element);
                });
                element.addClass("aui-buttons doc-aui-button-group");
            };

            renderView(scope.options);

            scope.$watch(function() {
                return ngModel.$viewValue;
            },function() {
                updateView();
            },true);
        }
    };
});