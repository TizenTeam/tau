if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

if (!CustomEvent) {
    function CustomEvent(type, data) {
        var evt = document.createEvent('Event');
        evt.initEvent(type, data.bubbles, data.cancelable);
        evt.detail = data.detail;
        return evt;
    }
}

// Mock tizen object
if (!window.tizen) {
	window.tizen = {
		contact: {
			getAddressBooks: function () {}
		},
		systeminfo:{
			getPropertyValue: function() {}
		}
	};
}