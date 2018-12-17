import React from 'react';
import { FormattedMessage } from 'react-intl';

module.exports = () => (
  <div>
    <FormattedMessage
      id="a"
      defaultMessage="Message a"
    />
    <FormattedMessage
      id="b"
      defaultMessage="Message b"
    />
  </div>
);