import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import Globals from 'api/globals';

import useGlobal from './use-global';

describe('use-global', function () {
  beforeEach(() => {
    Globals.remove({});
  });

  afterEach(() => {
    Globals.remove({});
    Globals.insert({});
  });

  it('correctly fetches a root prop', function () {
    Globals.insert({ blackout: true });
    const blackout = useGlobal('blackout');
    expect(blackout).to.equal(true);
  });

  it('correctly fetches a nested prop', function () {
    Globals.insert({
      cache_settings: {
        max_downloads: 5,
      },
    });
    const max_downloads = useGlobal('cache_settings.max_downloads');
    expect(max_downloads).to.equal(5);
  });

  it('correctly re-renders when prop changes', async function () {
    Globals.insert({ blackout: false });
    const TestComponent = ({ prop }) => {
      const value = useGlobal(prop);
      return <p>{value.toString()}</p>;
    };

    const wrapper = shallow(<TestComponent prop="blackout" />);
    expect(wrapper.equals(<p>false</p>)).to.be.true;

    const id = Globals.findOne()._id;
    Globals.update(id, { $set: { blackout: true } });

    wrapper.setProps({});
    expect(wrapper.equals(<p>true</p>)).to.be.true;
  });
});
