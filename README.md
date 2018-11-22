# @idagio/intl-utils
This package supplies utility scripts that can be used in conjunction with `react-intl`. The utilities can be used as part of a CI script or as individual CLI commands triggered manually.

You can read more about the background of this package [here]().

## Dependencies
Make sure to check out and follow guidelines of [rect-intl]() and [babel-plugin-react-intl]().

## Installation
For global cli use only:
```
$ npm install -g @idagio/intl-utils
```

For other uses:
```
$ npm install @idagio/intl-utils
```

## Usage
#### CLI
##### extract
Traverses all `.js` and `.jsx` files in your specified src directory and extracts their `react-intl` messages. It will then construct a json file out of these and write it to the specified location. This json file is intended to be used as `react-intl`'s default locale data.  
```
$ intl-utils extract <path-to-src> <target-file-path> <babel-config-path>
```
##### lint
Traverses all `.js` and `.jsx` files in your specified src directory and checks for potential problems. The linter can error because `babel-plugin-react-intl` errors or because messages were duplicated incorrectly across files. It is not allowed to define two messages with the same `id` but with differing `defaultMessage`.
```
$ intl-utils lint <path-to-src> <babel-config-path>
```
##### *babel-config-path*
Both commands supports supplying a custom babel config. The default one looks like this:
```js
{
  presets: ['es2015', 'stage-0', 'react'],
  plugins: ['react-intl'],
}
```
#### Programming interface
The utilities can also be used as part of another script:

```js
const { lint, extract } = require('@idagio/intl-utils');

// extract(sourcePath, targetPath, babelConfigPath);
// lint(sourcePath, babelConfigPath);
```
