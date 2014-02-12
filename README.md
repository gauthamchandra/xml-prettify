#xml-prettify
###(The file to download can be found in the 'dist' folder)
============

an XML Formatting Library that uses DOMParsers (and ActiveX object for IE) to "pretty print" XML

There is only one function:

```javascript
XmlPrettify.formatXml(...);
```

###Compatible with:
Every browser including all versions of IE.

If there isn't true, please let me know by opening an issue.

###Dependencies:
None. No jQuery, no other library or framework. Just plain JS.

###Parameters:

xml-prettify takes two parameters:
1. A string variable containing the XML String
2. An options object.

#####Options

The options object can contain the following options, *all* of which are optional

1. 'forDomElement' _<boolean>_<default: false>_ - This is a flag that specifies whether the output string will be used as innerHTML in DOM elements. If so, the formatXml will return the XML formatted string with all HTML tags escaped so that it can be directly inserted in an HTML element (e.g a pre tag).
2. 'prettyPrint' _<boolean> <default:false>_ - This causes the function to output as **syntactically highlighted** HTML. **This requires 'forDomElement' flag to be set to true'.**
3. 'useSpaces' _<boolean> <default: false>_ - Setting this flag to true causes the function string formatter to use the unicode space character ('\u0020' for formatting instead of the tab character '\t')
4. 'indentSpaceCount' _<number> <default: 3>_ - Setting this sets the number of spaces used for formatting a line of XML by the function string formatter. **This only is enabled if the 'useSpaces' option is also enabled**

##Examples
Format _just_ the XML String, no options

```javascript
XmlPrettify.formatXml('<customers><customer><name>Bob</name></customer></customers>');
```

Format the XML String for DOM Elements

```javascript
XmlPrettify.formatXml('<customers><customer><name>Bob</name></customer></customers>', { forDomElement: true });
```

Format the XML for DOM Elements with Syntactic Highlighting

```javascript
XmlPrettify.formatXml('<customers><customer><name>Bob</name></customer></customers>', {
    forDomElement: true,
    prettyPrint: true
 });
```

Format the XML with spaces instead of tabs and change the number of spaces used from the default (3) to 5

```javascript
XmlPrettify.formatXml('<customers><customer><name>Bob</name></customer></customers>', {
    useSpaces: true,
    indentSpaceCount: 2
 });

```
