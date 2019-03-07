/**
@ngdoc directive
@name umbraco.directives.directive:umbCheckbox
@restrict E
@scope

@description
<b>Added in Umbraco version 7.14.0</b> Use this directive to render an umbraco checkbox.

<h3>Markup example</h3>
<pre>
    <div ng-controller="My.Controller as vm">

        <umb-checkbox
            name="checkboxlist"
            value="{{key}}"
            model="true"
            text="{{text}}">
        </umb-checkbox>

    </div>
</pre>

@param {boolean} model Set to <code>true</code> or <code>false</code> to set the checkbox to checked or unchecked.
@param {string} value Set the value of the checkbox.
@param {string} name Set the name of the checkbox.
@param {string} text Set the text for the checkbox label.
@param {boolean} disabled Set the checkbox to be disabled.
@param {boolean} required Set the checkbox to be required.
@param {string} onChange Callback when the value of the input element changes.

**/

(function () {
    'use strict';

    function CheckboxDirective() {
        
        function link(scope, el, attr, ctrl) {
            
            scope.callOnChange = function() {
                scope.onChange({model:scope.model, value:scope.value});
            }
            
        }

        
        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/components/forms/umb-checkbox.html',
            scope: {
                model: "=",
                id: "@",
                value: "@",
                name: "@",
                text: "@",
                serverValidationField: "@",
                disabled: "=",
                required: "=",
                onChange: "&"
            },
            link: link
        };

        return directive;

    }

    angular.module('umbraco.directives').directive('umbCheckbox', CheckboxDirective);

})();
