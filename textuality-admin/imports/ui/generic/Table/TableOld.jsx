import React from 'react';
import autobind from 'autobind-decorator';
import mergeOptions from 'merge-options';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { toast } from 'react-toastify';

import TableInsertModal from './TableInsertModal';

const defaultOptions = {
    bordered: true,
    striped: true,
    hover: true,
    remote: () => {
        return {
            insertRow: true,
            dropRow: true,
            cellEdit: true
        };
    },
    options: {}
};

class Table extends React.Component {
    @autobind
    generateCallback(type) {
        if (this.props.methodPrefix) {
            let suffix = '';
            if (type === 'insert') suffix = '.new';
            if (type === 'update') suffix = '.update';
            if (type === 'delete') suffix = '.delete';
            return row => {
                if (type === 'insert') delete row._id;
                Meteor.call(this.props.methodPrefix + suffix, row, rowId => {
                    if (type === 'insert')
                        toast('Insert Successful', { type: 'success' });
                    if (type === 'update')
                        toast('Update Successful', { type: 'success' });
                    if (type === 'delete')
                        toast('Delete Successful', { type: 'success' });
                });
            };
        } else {
            let func = () => {
            };
            if (type === 'insert') return this.props.onInsert || func;
            if (type === 'update') return this.props.onUpdate || func;
            if (type === 'delete') return this.props.onDelete || func;
            return func;
        }
    }

    render() {
        let {
            columns,
            data,
            tableArgs,
            canInsert,
            canDelete,
            canEdit,
            methodPrefix,
            form
        } = this.props;

        let moreArgs = mergeOptions(defaultOptions, tableArgs);

        if (canInsert) {
            moreArgs.insertRow = true;
            moreArgs.options.onAddRow = this.generateCallback('insert');
            moreArgs.options.insertModal = (
                onClose,
                onSave,
                columns,
                validateState
            ) => (
                <TableInsertModal
                    onClose={onClose}
                    onSave={onSave}
                    columns={columns}
                    form={form}
                />
            );
        }
        if (canDelete) {
            moreArgs.deleteRow = true;
            moreArgs.options.onDeleteRow = this.generateCallback('delete');
        }

        if (canEdit) {
            moreArgs.cellEdit = {
                mode: 'click',
                blurToSave: true
            };
            moreArgs.options.onCellEdit = this.generateCallback('update');
        }

        return (
            <BootstrapTable {...moreArgs} data={data} version='4'>
                {columns.map(column => {
                    return (
                        <TableHeaderColumn key={column.dataField} {...column}>
                            {column.header}
                        </TableHeaderColumn>
                    );
                })}
            </BootstrapTable>
        );
    }
}

export default Table;
