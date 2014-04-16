/*global module, test, expect, stop, start, ej, ok, strictEqual, equal */
/*jslint plusplus: true, nomen: true */
module("Object");

var SimpleObject = function (prop1) {
	this.prop1 = prop1;
}
SimpleObject.prototype.protProp1 = "prototyp"; 

test("ej.utils.object.copy - checking copy function", function () {
	var data = ej.utils.object,
		orgObject = {},
		newObject;

	orgObject.prop1 = "one";
	orgObject.prop2 = 2;
	newObject = data.copy(orgObject);
	equal(typeof newObject, "object", "The returned value is an object");
	equal(newObject.prop1, orgObject.prop1, "New Object has same properties as orginal Object properties by copy");
	equal(newObject.prop2, orgObject.prop2, "New Object has same properties as orginal Object properties by copy");

	orgObject = new SimpleObject("one");
	newObject = data.copy(orgObject);
	equal(newObject.prop1, orgObject.prop1, "New Object has same properties as orginal Object properties by copy");
	notEqual(newObject.protProp1, orgObject.prop1, "The prototype property wasn't copied");
});

test("ej.utils.object.merge - checking merge function", function () {
	var data = ej.utils.object,
		newObject,
		orgObject;

	newObject = new SimpleObject("one");
	newObject.prop2 = "twonew";
	orgObject = {};
	orgObject.propertyToMerge = "original";
	orgObject.prop2 = "twooriginal";
	orgObject.prop3 = [1,2,3];

	data.simpleMerge(newObject, orgObject);
	equal(newObject.propertyToMerge, orgObject.propertyToMerge, "New Object has same properties as orginal Object properties by copy");
	equal(newObject.prop2, orgObject.prop2, "New Object has same properties as orginal Object properties by copy");
	equal(newObject.prop3, orgObject.prop3, "New Object has same properties as orginal Object properties by copy");
	orgObject.prop3.push(4);
	equal(newObject.prop3, orgObject.prop3, "Both objects point to this same array, its not a deep copy");
});

test("ej.utils.object.merge - checking multimerge function", function () {
	var data = ej.utils.object,
		newObject,
		orgObject1,
		orgObject2;

	orgObject1 = {};
	orgObject2 = {};
	newObject = {};
	orgObject1.prop1o = "orgObject1";
	orgObject2.prop2o = "orgObject2";
	newObject.prop1 = "newObject";

	data.merge(newObject, orgObject1, orgObject2);
	equal(newObject.prop1o, orgObject1.prop1o, "New Object has same properties as orgObject1 Object properties by copy");
	equal(newObject.prop2o, orgObject2.prop2o, "New Object has same properties as orgObject2 Object properties by copy");

});