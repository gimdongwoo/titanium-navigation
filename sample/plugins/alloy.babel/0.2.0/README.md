# alloy.babel
Appcelerator Titanium plugin which enables ES6, Pug (Jade), STSS support for Alloy projects

## Configuration
1. Place all your code in the folder `src` instead of `app`
2. `npm install --save alloy.babel`
3. Add `<plugin version="${plugin_version}">alloy.babel</plugin>` to your `tiapp.xml > ti:app > plugins` XML element.
**Note:** this plugin should appear before `ti.alloy` plugin
