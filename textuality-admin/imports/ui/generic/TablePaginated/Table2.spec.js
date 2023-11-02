import React from 'react';
import { expect } from 'chai';
import td from 'testdouble';
import { mount, render, shallow } from 'enzyme';

import 'utils/test-helpers/setup-testdouble';
import 'utils/test-helpers/setup-enzyme';
import 'utils/test-helpers/setup-jsdom';

describe('generic/Table2', () => {
  let stubTableContainer, Table2;

  beforeEach(() => {
    stubTableContainer = td.replace(
      '@mui/material/TableContainer',
      ({ children }) => <>{children}</>,
    );
    Table2 = require('./TablePaginated').default;
  });

  afterEach(() => {
    td.reset();
  });

  it('smoke test', () => {
    const wrapper = shallow(
      <Table2
        columns={[{ Header: 'Name', accessor: 'name' }]}
        data={[{ name: 'test' }]}
      />,
    );
    stubTableContainer;
    expect(wrapper.find(stubTableContainer)).to.have.length(1);
  });

  it('should call setQuery with default args', () => {
    const setQuery = td.function();
    const wrapper = mount(
      <Table2
        columns={[{ Header: 'Name', accessor: 'name' }]}
        data={[{ name: 'test' }]}
        setQuery={setQuery}
        total={50}
        count={10}
      />,
    );

    expect(setQuery).to.have.been.calledWith({
      page: 0,
      count: 10,
      search: '',
    });
  });

  it('should call setQuery with search arg if search filled in', async () => {
    const setQuery = td.function();
    const wrapper = mount(
      <Table2
        columns={[{ Header: 'Name', accessor: 'name' }]}
        data={[{ name: 'test' }]}
        setQuery={setQuery}
        total={50}
        count={10}
      />,
    );

    const search = wrapper.find('input[type="search"]');
    search.simulate('change', { target: { value: 'test' } });

    await new Promise((resolve) => setTimeout(() => resolve(), 300));

    expect(setQuery).to.have.been.calledWith({
      page: 0,
      count: 10,
      search: 'test',
    });
  });

  it('should render a delete button that calls onDelete', () => {
    const onDelete = td.function();
    const wrapper = mount(
      <Table2
        columns={[{ Header: 'Name', accessor: 'name' }]}
        data={[{ _id: 'test-id', name: 'test' }]}
        setQuery={td.function()}
        canDelete={true}
        onDelete={onDelete}
      />,
    );

    const deleteBtn = wrapper.find(
      'tbody tr[role="row"] button[aria-label="delete"]',
    );
    expect(deleteBtn.length).to.equal(1);

    deleteBtn.simulate('click');

    expect(onDelete).to.have.been.calledWith(['test-id']);
  });

  it('should render a duplicate button that calls onDuplicate', () => {
    const onDuplicate = td.function();
    const wrapper = mount(
      <Table2
        columns={[{ Header: 'Name', accessor: 'name' }]}
        data={[{ _id: 'test-id', name: 'test' }]}
        setQuery={td.function()}
        canDuplicate={true}
        onDuplicate={onDuplicate}
      />,
    );

    const duplicateBtn = wrapper.find(
      'tbody tr[role="row"] button[aria-label="duplicate"]',
    );
    expect(duplicateBtn.length).to.equal(1);

    duplicateBtn.simulate('click');

    expect(onDuplicate).to.have.been.calledWith(['test-id']);
  });

  it('should render a customAction that calls its onClick', () => {
    const testOnClick = td.function();
    const fakeIcon = () => <div></div>;
    const wrapper = mount(
      <Table2
        columns={[{ Header: 'Name', accessor: 'name' }]}
        data={[{ _id: 'test-id', name: 'test' }]}
        setQuery={td.function()}
        customActions={[
          {
            icon: fakeIcon,
            onClick: testOnClick,
          },
        ]}
      />,
    );

    const iconButton = wrapper.find(fakeIcon);
    expect(iconButton.length).to.equal(1);

    expect(testOnClick).to.have.not.been.called;
    iconButton.simulate('click');
    expect(testOnClick).to.have.been.called;
  });
});
