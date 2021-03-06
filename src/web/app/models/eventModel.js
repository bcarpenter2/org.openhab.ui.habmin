/**
 * HABmin - Home Automation User and Administration Interface
 * Designed for openHAB (www.openhab.com)
 *
 * This software is copyright of Chris Jackson under the GPL license.
 * Note that this licence may be changed at a later date.
 *
 * (c) 2014-2015 Chris Jackson (chris@cd-jackson.com)
 */
angular.module('HABmin.eventModel', [])

    .service('EventModel', function ($rootScope) {
        var eventSrc;
        var events = {};

        this.listen = function () {
            eventSrc = new EventSource("/rest/events?topics=smarthome/*");
            eventSrc.addEventListener('message', function (rxEvent) {
                console.log(rxEvent.type);
                console.log(rxEvent.data);

                var event = angular.fromJson(rxEvent.data);
                var payload = angular.fromJson(event.payload);
                var topic = event.topic.split("/");

                if(events[event.type] != null) {
                    events[event.type](event, payload);
                }

                // Broadcast an event so we update any widgets or listeners
//                $rootScope.$broadcast(evt.topic, evt.object);
            });
        };

        this.registerEvent = function(eventName, eventFunction) {
            events[eventName] = eventFunction;
        }
    })
;
