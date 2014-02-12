#xml-prettify
============

an XML Formatting Library that uses DOMParsers (and ActiveX object for IE) to "pretty print" XML

There is only one function:

```javascript
XmlPrettify.formatXml(...);
```

###Download:
Find it in the 'dist' folder of this repository


###Compatibility:
Supported Browsers:
* Chrome
* Firefox
* Opera

####Currently Fixing:
* Safari
* All versions of IE.

If this isn't true, please let me know by opening an issue.

###Dependencies:
None. No jQuery, no other library or framework. Just plain JS.

###Parameters:

xml-prettify takes two parameters:

1. A string variable containing the XML String
2. An options object.

#####Options

The options object can contain the following options, *all* of which are optional

<table>
	<thead>
		<th>Option Name</th>
		<th>Default Value</th>
		<th>Type</th>
		<th>Description</th>
	</thead>
	<tbody>
		<tr>
			<td>forDomElement</td>
			<td>boolean</td>
			<td>false</td>
			<td>
				This is a flag that specifies whether the output string will be used as innerHTML in DOM elements. If so, the formatXml will return the XML formatted string with all HTML tags escaped so that it can be directly inserted in an HTML element (e.g a pre tag).
			</td>
		</tr>
		<tr>
			<td>prettyPrint</td>
			<td>boolean</td>
			<td>false</td>
			<td>
				This causes the function to output as <em>syntactically highlighted HTML.</em> <strong>This requires 'forDomElement' flag to be set to true'.</strong>
			</td>
		</tr>	
		<tr>
			<td>useSpaces</td>
			<td>boolean</td>
			<td>false</td>
			<td>
				Setting this flag to true causes the function string formatter to use the unicode space character (<strong>'\u0020'</strong> for formatting instead of the tab character <strong>'\t'</strong>)
			</td>
		</tr>	
		<tr>
			<td>indentSpaceCount</td>
			<td>number</td>
			<td>3</td>
			<td>
				Setting this sets the number of spaces used for formatting a line of XML by the function string formatter. <strong>This only is enabled if the 'useSpaces' option is also enabled<strong>
			</td>
		</tr>
	</tbody>

</table>


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
    indentSpaceCount: 5
 });
```
