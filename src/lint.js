/* eslint-disable no-console */

const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');
const intlCollectMessages  = require('./collect');

const sourcePath = path.join(__dirname, '..', '..', 'src');

/*
  This linter works as a compliment to the linting capabilities that are
  already present in babel-plugin-react-intl. The babel plugin checks that
  messages with the same id also has identical defaultMessages. However,
  since we perform each extraction once for every file (see other intl scripts)
  and not on a concatenated bundle, this check is lost across files. Our linter
  rectifies this by performing the check not on the source code, but on
  the already extracted messages.
*/

function lintIntl(aggregatedMessages) {
  const uniqMsgs = _.uniq(aggregatedMessages, 'id');
  const duplicateIds = _.difference(aggregatedMessages, uniqMsgs).map(message => message.id);
  const violatingIds = _.uniq(duplicateIds.filter((id) => { // uniq to avoid reporting same id twice
    const allMessagesForId = aggregatedMessages.filter(message => message.id === id);
    return _.uniq(allMessagesForId, 'defaultMessage').length > 1; // Has different messages for same Id
  }));

  if (violatingIds.length) {
    console.error(chalk`{red Error: Duplicated react-intl message(s) with differing defaultMessage(s) found}`);
    violatingIds.forEach((id) => {
      console.log(chalk`{yellow   {red 𐄂} ${id}}`);
    });
    process.exit(1);
  }

  console.log(chalk`{green No problems with intl found! 🌸}`);
}

console.log(chalk`{white Linting intl messages...}`);
intlCollectMessages(sourcePath, lintIntl);
