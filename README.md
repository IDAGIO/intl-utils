# @idagio/intl-utils
This package acts as a wrapper around [babel-plugin-react-intl](https://github.com/yahoo/babel-plugin-react-intl) and exposes utility functions meant to make it easier to use in an automation workflow.

You can read more about the background of this package [in this medium article](https://medium.com/@david_naas/a51ca600c430). The article explains this package's intended use and hot it's different from using the babel plugin directly.

Also make sure to check out and follow the guidelines of [react-intl](https://github.com/yahoo/react-intl) and [babel-plugin-react-intl](https://github.com/yahoo/babel-plugin-react-intl).

## Installation
For global cli use only:
```
$ npm install -g @idagio/intl-utils
```

For other uses:
```
$ npm install @idagio/intl-utils
```

#### A note on babel
It is not required of the user to install `babel-plugin-react-intl`, this dependency is already provided and will automatically be appended to the babel config. However, it is important that the babel config provided contains the correct presets and that these presets are installed. Otherwise this package might not be able to parse the provided source files.  

### Usage
```js
const { lint, extract } = require('@idagio/intl-utils');
```
#### extract
Traverses all `.js` and `.jsx` files in your specified src directory and extracts their `react-intl` messages. It will then construct a json file out of these and write it to the specified location. This json file is intended to be used as `react-intl`'s default locale data.
##### Arguments
1. `sourcePath` (*String*): relative path to your source directory
2. `targetPath` (*String*): relative path to resulting json file
3. `babelConfigPath` (*String*): relative OR absolute path to your babelrc file.

*Example usage*:
```js
extract('src', 'locales/en-GB.json', './.babelrc');
```
#### lint
Traverses all `.js` and `.jsx` files in your specified src directory and checks for potential problems. The linter can error because `babel-plugin-react-intl` errors or because messages were duplicated incorrectly across files. It is not allowed to define two messages with the same `id` but with differing `defaultMessage`.
##### Arguments
1. `sourcePath` (*String*): relative path to your source directory
2. `babelConfigPath` (*String*): relative OR absolute path to your babelrc file.

*Example usage*:
```js
lint('src', './.babelrc');
```

### CLI
The package can also be used as a global CLI tool. The commands and arguments are completely analogous to the ones in the programming interface.
##### extract  
```
$ intl-utils extract <path-to-src> <target-file-path> <babel-config-path>
```
##### lint
```
$ intl-utils lint <path-to-src> <babel-config-path>
```
