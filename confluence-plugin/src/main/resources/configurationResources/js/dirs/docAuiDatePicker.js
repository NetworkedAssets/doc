angular.module("DoC_Config").directive('docAuiDatePicker', [function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            AJS.$(element).datePicker({
                onSelect: function(value) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(value);
                    });
                },
                overrideBrowserDefault: true
            });
        }
    };
}]);