/**
@ngdoc directive
@name umbraco.directives.directive:umbTooltip
@restrict E
@scope

@description
Use this directive to render a tooltip.

<h3>Markup example</h3>
<pre>
    <div ng-controller="Umbraco.Controller as vm">

        <div
            ng-mouseover="vm.mouseOver($event)"
            ng-mouseleave="vm.mouseLeave()">
            Hover me
        </div>

        <umb-tooltip
           ng-if="vm.tooltip.show"
           event="vm.tooltip.event">
           // tooltip content here
        </umb-tooltip>

    </div>
</pre>

<h3>Controller example</h3>
<pre>
    (function () {
        "use strict";

        function Controller() {

            var vm = this;
            vm.tooltip = {
                show: false;
                event: null;
            };

            vm.mouseOver = mouseOver;
            vm.mouseLeave = mouseLeave;

            function mouseOver($event) {
                vm.tooltip = {
                    show: true;
                    event: $event;
                };
            }

            function mouseLeave() {
                vm.tooltip = {
                    show: false;
                    event: null;
                };
            }

        }

        angular.module("umbraco").controller("Umbraco.Controller", Controller);

    })();
</pre>

@param {string} event Set the $event from the target element to position the tooltip relative to the mouse cursor.
**/

(function() {
   'use strict';

   function TooltipDirective($timeout) {

      function link(scope, el, attr, ctrl) {

         scope.tooltipStyles = {};
         scope.tooltipStyles.left = 0;
         scope.tooltipStyles.top = 0;

         function activate() {

            $timeout(function() {
               setTooltipPosition(scope.event);
            });

         }

         function setTooltipPosition(event) {

            var viewportWidth = null;
            var viewportHeight = null;
            var elementHeight = null;
            var elementWidth = null;

            var position = {
               right: "inherit",
               left: "inherit",
               top: "inherit",
               bottom: "inherit"
            };

            // viewport size
            viewportWidth = $(window).innerWidth();
            viewportHeight = $(window).innerHeight();

            // element size
            elementHeight = el.context.clientHeight;
            elementWidth = el.context.clientWidth;

            position.left = event.pageX - (elementWidth / 2);
            position.top = event.pageY;

            // check to see if element is outside screen
            // outside right
            if (position.left + elementWidth > viewportWidth) {
               position.right = 0;
               position.left = "inherit";
            }

            // outside bottom
            if (position.top + elementHeight > viewportHeight) {
               position.bottom = 0;
               position.top = "inherit";
            }

            scope.tooltipStyles = position;

         }

         activate();

      }

      var directive = {
         restrict: 'E',
         transclude: true,
         replace: true,
         templateUrl: 'views/components/umb-tooltip.html',
         scope: {
            event: "="
         },
         link: link
      };

      return directive;
   }

   angular.module('umbraco.directives').directive('umbTooltip', TooltipDirective);

})();
