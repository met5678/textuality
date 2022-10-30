import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/ui/App';

Meteor.startup(() => {
  render(<App />, document.getElementById('app'));

  window.onload = function() {
    setTimeout(function() {
      window.scrollTo(0, 1);
    }, 0);
  };
});
