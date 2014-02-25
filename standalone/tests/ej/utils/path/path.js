/*global $: false, ej: false,
 module: false, test:false, equal: false*/
document.addEventListener('DOMContentLoaded', function () {
	'use strict';
	var path = ej.utils.path;
	module('ej.utils.path');
	test('isAbsoluteUrl', function () {
		equal(path.isAbsoluteUrl('http://localhost'), true, 'isAbsoluteUrl for absolute url "http://localhost"');
		equal(path.isAbsoluteUrl('..'), false, 'isAbsoluteUrl for relative url ".."');
	});

	test('getAsURIParameters', function () {
		equal(path.getAsURIParameters({}), "", 'getAsURIParameters for {}');
		equal(path.getAsURIParameters({a: 'b', c: 'd'}), "a=b&c=d", 'getAsURIParameters for {a: "b", c:"d"}');
	});

	test('addSearchParams', function () {
		equal(path.addSearchParams('', {}), "?", 'addSearchParams for {}');
		equal(path.addSearchParams('index.html', {a: 'b', c: 'd'}), "index.html?a=b&c=d", 'addSearchParams for {a: "b", c:"d"}');
	});
/*
	test('convertUrlToDataUrl', function () {
		equal(path.convertUrlToDataUrl('/index.html', '', '/home/test/page.html'), "/", 'convertUrlToDataUrl for "/index.html", "", "/home/test/page.html"');
		equal(path.convertUrlToDataUrl('../../index.html', '', '/home/test/page.html'), ".", 'convertUrlToDataUrl for "../../index.html", "", "/home/test/page.html"');
	});

	test('get', function () {
		equal(path.get(), "test1", 'get for ""');
		equal(path.get('#hash'), "hash", 'get for "#hash"');
	});
*/
	test('isPath', function () {
		equal(path.isPath(), false, 'isPath for ""');
		equal(path.isPath('index.html'), false, 'isPath for "index.html"');
		equal(path.isPath('../'), true, 'isPath for "../"');
	});

	test('clean', function () {
		equal(path.clean("http://localhost/index.html", ej.utils.path.parseUrl("http://localhost/index.html")), "/index.html", 'clean for "http://localhost/index.html"');
		equal(path.clean("http://localhost/test/index.html", ej.utils.path.parseUrl("http://localhost/index.html")), "/test/index.html", 'clean for "http://localhost/test/index.html"');
	});

	test('cleanHash', function () {
		equal(path.cleanHash("#hash"), "hash", 'cleanHash for {}');
		equal(path.cleanHash('#hash?asas'), "hash", 'cleanHash for {a: "b", c:"d"}');
	});

	test('isHashValid', function () {
		equal(path.isHashValid(), false, 'isHashValid for ""');
		equal(path.isHashValid('/index.html#hash'), false, 'isHashValid for {a: "b", c:"d"}');
		equal(path.isHashValid('#hash'), true, 'isHashValid for {a: "b", c:"d"}');
	});

	test('isExternal', function () {
		equal(path.isExternal(), false, 'isExternal for {}');
		equal(path.isExternal('http://localhost/index.html#hash', ej.utils.path.parseUrl("http://localhost2/index.html")), true, 'isExternal for {a: "b", c:"d"}');
		equal(path.isExternal('#hash', ej.utils.path.parseUrl("http://localhost/index.html")), false, 'isExternal for {a: "b", c:"d"}');
	});

	test('hasProtocol', function () {
		equal(path.hasProtocol(), "", 'hasProtocol for {}');
		equal(path.hasProtocol('localhost'), false, 'hasProtocol for {a: "b", c:"d"}');
		equal(path.hasProtocol('http://localhost'), true, 'hasProtocol for {a: "b", c:"d"}');
	});

	test('isFirstPageUrl', function () {
		equal(path.isFirstPageUrl('index.html#hash',
				ej.utils.path.parseUrl("http://localhost/index.html"),
				null,
				ej.utils.path.parseUrl("http://localhost/index.html")), false, 'isFirstPageUrl for {a: "b", c:"d"}');
		equal(path.isFirstPageUrl('index.html#test1',
				ej.utils.path.parseUrl("http://localhost/index.html"),
				null,
				ej.utils.path.parseUrl("http://localhost/index.html")), true, 'isFirstPageUrl for {a: "b", c:"d"}');
	});

	test('isPermittedCrossDomainRequest', function () {
		equal(path.isPermittedCrossDomainRequest(ej.utils.path.parseUrl('http://localhost/aaa.html'), 'http://localhost/bbb.html'), false, 'isPermittedCrossDomainRequest');
		equal(path.isPermittedCrossDomainRequest(ej.utils.path.parseUrl('file://localhost/aaa.html'), 'http://localhost2/bbb.html'), false, 'isPermittedCrossDomainRequest');
		ej.set('allowCrossDomainPages', true);
		equal(path.isPermittedCrossDomainRequest(ej.utils.path.parseUrl('http://localhost/aaa.html'), 'http://localhost/bbb.html'), false, 'isPermittedCrossDomainRequest');
		equal(path.isPermittedCrossDomainRequest(ej.utils.path.parseUrl('file://localhost/aaa.html'), 'http://localhost2/bbb.html'), true, 'isPermittedCrossDomainRequest');
	});
});