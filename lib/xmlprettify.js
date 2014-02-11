/* exported XmlPrettify */
var XmlPrettify = (function(window, document, undefined) {
    "use strict";

    var MalformedXMLError = function(message) {
        var err = new Error(message);
        err.name = 'MalformedXMLError';
        this.name = err.name;
        this.message = err.message;
        if (err.stack) {
            this.stack = err.stack;
        }
        this.toString = function() {
           return this.name + ': ' + this.message;
        };
    };
    MalformedXMLError.prototype = Error.prototype;
    MalformedXMLError.prototype.name = 'MalformedXMLError';



    var self = {}; //an object to hold some internal values and functions
    self.formatString = "";

    if (window.DOMParser) {
        self.parseXml = function(xmlStr) {
            return (new window.DOMParser()).parseFromString(xmlStr, 'text/xml');
        };
    } else if (window.ActiveXObject && new window.ActiveXObject('Microsoft.XMLDOM')) {
        self.parseXml = function(xmlStr) {
            var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = 'false';
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        };
    }
    else {
        throw new Error("No XML parser found");
    }

    /**
     * The internally recursive function used to format the XML
     * */
    self._formatXml = function(elem, formattedString, indent, options, indentChar) {

        var tags = elem.outerHTML.replace(elem.innerHTML, '').replace('><', '>*seperator*<').split('*seperator*');

        //default the indent character to a tab if its undefined
       indentChar = indentChar || '\t';

        //check to see if its for a dom element
        //if so, the '<' and '>' of the tags need to be replaced with their html equivalents
        if (options.forDomElement) {
            tags[0] = tags[0].replace(/</g, '&lt;').replace(/>/g, '&gt;');

            //there could be a self enclosed tag (i.e <hello /> instead of <hello></hello>) so check the length
            if (tags[1]) {
                tags[1] = tags[1].replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }


            if (options.prettyPrint) {
                //highlight the '<' and '>' in blue
                tags[0] = tags[0].replace(/&gt;/g, '<span style="color:blue">&gt;</span>')
                    .replace(/&lt;/g, '<span style="color:blue">&lt;</span>');

                if (tags[1]) {
                    tags[1] = tags[1].replace(/&gt;/g, '<span style="color:blue">&gt;</span>')
                        .replace(/&lt;\//g, '<span style="color:blue">&lt;/</span>');
                }

                //highlight the tag name in 1 color
                tags[0] = tags[0].replace(new RegExp(elem.nodeName, 'g'),
                    '<span style="color:brown">' + elem.nodeName + '</span>');

                if (tags[1]) {
                    tags[1] = tags[1].replace(new RegExp(elem.nodeName, 'g'),
                        '<span style="color:brown">' + elem.nodeName + '</span>');
                }

                //highlight the attributes in another color
                for (var i = 0; i < elem.attributes.length; i++) {
                    //if they used double quotes for the attribute
                    tags[0] = tags[0].replace(new RegExp(elem.attributes[i].nodeName + '="' +
                        elem.attributes[i].nodeValue + '"'), '<span style="color:red">'+ elem.attributes[i].nodeName +
                        '</span><span style="color:blue">=' + '"' + elem.attributes[i].nodeValue + '"' + '</span>');
                    //if they used single quotes for the attribute value
                    tags[0] = tags[0].replace(new RegExp(elem.attributes[i].nodeName + "='" +
                        elem.attributes[i].nodeValue + '"'), "<span style='color:red'>" + elem.attributes[i].nodeName +
                        "</span><span style='color:blue'>='" + elem.attributes[i].nodeValue + "'" + "</span>");
                }
            }
        }

        formattedString += (new Array(indent)).join(indentChar) + tags[0].trim() + '\n';


        for (var j = 0; j < elem.childNodes.length; j++) {
            if (elem.childNodes[j] instanceof Element) {
                formattedString = self._formatXml(elem.childNodes[j], formattedString, indent + 1, options, indentChar);
            }
            else if (elem.childNodes[j] instanceof Node && elem.childNodes[j].textContent.trim()) {
                formattedString += (new Array(indent + 1)).join(indentChar) + elem.childNodes[j].textContent + '\n';
            }
        }

        if (tags[1]) {
            formattedString += (new Array(indent)).join(indentChar) + tags[1].trim() + '\n';
        }


        return formattedString;
    };

    return {

        /**
         * The main function that sets up the string to be passed to _formatXml, the real internal function
         * */
        formatXml: function(xmlStr, options) {
            var initXmlObj = self.parseXml(xmlStr.trim());

            var elem = initXmlObj.documentElement;

            //first check if there is a parser error due to malformed XML passed to the function
            //if so, dig into the tag and rip out the error message
            if (elem.firstElementChild && elem.firstElementChild.nodeName === 'parsererror') {
                var parserErrorElem = elem.firstElementChild.childNodes[1];

                throw new MalformedXMLError(parserErrorElem.textContent.replace('\n','')
                    .replace(parserErrorElem.textContent.substring(0,
                        parserErrorElem.textContent.indexOf(':')+1), '').trim());
            }


            if (options) {
                //default to tab character
                var indentChar = (options.useSpaces) ? '\u0020' : '\t';

                //check to see if useSpaces flag is enabled AND indentSpaceCount is a valid number that isn't NaN
                if (options.useSpaces) {
                    var indentNumber = (typeof(options.indentSpaceCount) !== 'undefined') ?
                        parseInt(options.indentSpaceCount, 10) : 3;

                    if (indentNumber === indentNumber) {
                        //if it is, repeat the string, the specified number of times and make it the new indent
                        //character
                        if (indentNumber <= 0) {
                            throw new RangeError("The 'indentSpaceCount' option has to be >= 0");
                        }

                        indentChar = (new Array(indentNumber + 1)).join('\u0020');
                    }
                    else {
                        throw new TypeError("The 'indentSpaceCount' option has to be a valid number");
                    }
                }

                return self._formatXml(elem, '', 1, options, indentChar);
            }
            else {
                return self._formatXml(elem, '', 1, {});
            }

        }

    };

}(window, document));