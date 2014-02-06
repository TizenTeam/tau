(function() {

var newGear = gear.noConflict();
gear.ui.VirtualListview = newGear.ui.VirtualListview.bind(newGear.ui);

}());
