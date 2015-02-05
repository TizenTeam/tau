var marquee = tau.decorator.marquee;

module('core/decorator/marquee');

test("tau.decorator.marquee - check the existence of objects/functions", function () {
	equal(typeof tau, "object", "tau exists");
	equal(typeof tau.decorator, "object", "tau.decorator exists");
	equal(typeof tau.decorator.marquee, "object", "tau.decorator.marquee exists");
	equal(typeof marquee.enable, "function", "function enable");
	equal(typeof marquee.disable, "function", "function disable");
	equal(typeof marquee.classes, "object", "object classes");
});
