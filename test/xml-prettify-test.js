/* jshint globalstrict: true */
/* global XmlPrettify: false */
'use strict';
module('xml-prettify test suite');

test('Invalid indentSpaceCount Option Test', function() {

    throws(function() {
        XmlPrettify.formatXml('<node></node>', { useSpaces: true, indentSpaceCount: -3 });
    }, RangeError, 'A negative value is out of bounds and should throw a RangeError');

    throws(function() {
        XmlPrettify.formatXml('<node></node>', { useSpaces: true, indentSpaceCount: 0 });
    }, RangeError, 'A value of 0 for indentSpaceCount is out of bounds and should throw a RangeError.');

    throws(function() {
        XmlPrettify.formatXml('<node></node>', { useSpaces: true, indentSpaceCount: 'blah'});
    }, TypeError, 'Invalid text strings for indentSpaceCount should result in a TypeError');

    throws(function() {
        XmlPrettify.formatXml('<node></node>', { useSpaces: true, indentSpaceCount: {}});
    }, TypeError, 'Passing objects for indentSpaceCount should result in a TypeError');
});

test('Malformed XML Test', function() {
    throws(function() {
        XmlPrettify.formatXml('<dsds', 'text/xml');
    }, function(error) {
        return error.name === 'MalformedXMLError';
    }, 'Syntax error should result when malformed XML is passed');
});

test('Invalid Type Test for Xml String Param', function() {
   throws(function() {
       XmlPrettify.formatXml(9, 'text/xml');
   }, TypeError, 'TypeError should be thrown if the first parameter to formatXml is a number');

    throws(function() {
        XmlPrettify.formatXml(false, 'text/xml');
    }, TypeError, 'TypeError should be thrown if the first parameter to formatXml is a boolean');

    throws(function() {
        XmlPrettify.formatXml({}, 'text/xml');
    }, TypeError, 'TypeError should be thrown if the first parameter to formatXml is an object');
});