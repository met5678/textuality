import React from 'react';
import Meteor from 'meteor/meteor';
import { Button } from 'reactstrap';

const TableOrderCell = ({ idx, total, onReorder }) => {
	return (
		<>
			<Button
				size="sm"
				color="primary"
				className="mr-1"
				disabled={idx <= 0}
				onClick={() => onReorder(idx, idx - 1)}
			>
				<i className="fas fa-arrow-up" />
			</Button>
			<Button
				size="sm"
				color="primary"
				disabled={idx >= total - 1}
				onClick={() => onReorder(idx, idx + 1)}
			>
				<i className="fas fa-arrow-down" />
			</Button>
		</>
	);
};

export default TableOrderCell;
