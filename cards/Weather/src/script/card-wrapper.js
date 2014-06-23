/*global window */
(function (window) {
    "use strict";
    if (!window.tizen) {
        window.tizen = {};
    }

    if (!window.tizen.communication) {
        window.tizen.communication = {};
    }

    if (!window.tizen.communication.sendMessageToHost) {
        window.tizen.communication.sendMessageToHost = function (message) {
            window.location.href = "com://send-message-to-host?message=" + message;
        };
    }
}(window));
