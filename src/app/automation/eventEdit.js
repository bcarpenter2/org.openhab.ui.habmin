/**
 * HABmin - Home Automation User and Administration Interface
 * Designed for openHAB (www.openhab.com)
 *
 * This software is copyright of Chris Jackson under the GPL license.
 * Note that this licence may be changed at a later date.
 *
 * (c) 2014-2015 Chris Jackson (chris@cd-jackson.com)
 */
angular.module('Automation.editEvent', [
    'ui.bootstrap',
    'ngSanitize',
    'angular-growl',
    'HABmin.itemModel',
    'HABmin.smarthomeModel',
    'ngLocalize'
])
    .service('eventEdit',
    function ($modal, $rootScope, growl, locale, UserService, ItemModel, SmartHomeModel) {
        this.add = function (date) {
            var event = {
                start: date.format()
            };
            doModal(event);
        };

        this.edit = function (event) {
//            scope.item = angular.copy(item);
//            scope.itemtypes = SmartHomeModel.itemtypes;
//            scope.categories = SmartHomeModel.categories;

            doModal(event);
        };

        function doModal (event) {
            var scope = $rootScope.$new();
            scope.event = angular.copy(event);

            scope.items = [];
            ItemModel.getList().then(
                function (list) {
                    scope.items = list;
                }
            );

            /**
             * Controller functions get called when the modal closes
             * @param $scope
             * @param $modalInstance
             */
            var controller = function ($scope, $modalInstance) {
                $scope.ok = function (result) {
                    $scope.item.groupNames = [].concat($scope.item.groupNames);
                    ItemModel.putItem($scope.item).then(
                        function () {
                            $modalInstance.close($scope.item);
                        },
                        function () {
                            growl.warning(locale.getString("habmin.itemSaveFailed",
                                {name: $scope.item.label}));
                        }
                    );
                };
                $scope.cancel = function (result) {
                    $modalInstance.dismiss('cancel');
                };
            };

            return $modal.open({
                backdrop: 'static',
                keyboard: true,
                modalFade: true,
                size: 'lg',
                templateUrl: 'automation/eventEdit.tpl.html',
                controller: controller,
                windowClass: UserService.getTheme(),
                scope: scope
            }).result;
        };
    })

;
