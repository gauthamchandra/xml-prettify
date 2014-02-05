/* exported XmlPrettify */
var XmlPrettify = (function(window, document, undefined) {
    "use strict";


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
    self._formatXml = function(elem, formattedString, indent, options) {

        var tags = elem.outerHTML.replace(elem.innerHTML, '').replace('><', '>*seperator*<').split('*seperator*');

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

        formattedString += (new Array(indent)).join('\t') + tags[0].trim() + '\n';


        for (var j = 0; j < elem.childNodes.length; j++) {
            if (elem.childNodes[j] instanceof Element) {
                formattedString = self._formatXml(elem.childNodes[j], formattedString, indent + 1, options);
            }
            else if (elem.childNodes[j] instanceof Node && elem.childNodes[j].textContent.trim()) {
                formattedString += (new Array(indent + 1)).join('\t') + elem.childNodes[j].textContent + '\n';
            }
        }

        if (tags[1]) {
            formattedString += (new Array(indent)).join('\t') + tags[1].trim() + '\n';
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

            if (options) {
                return self._formatXml(elem, '', 1, options);
            }
            else {
                return self._formatXml(elem, '', 1, {});
            }

        }

    };

}(window, document));