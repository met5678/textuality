import React from 'react';
import { Badge } from 'reactstrap';
import { Link } from 'react-router-dom';

generateObjColumn = kind => {
  return (cell, row) => {
    if (typeof cell === 'function') {
      const obj = cell.call(row);

      return obj ? (
        <Link to={`/${kind}/${obj._id}`}>
          <Badge color="success">Goto</Badge>
        </Link>
      ) : (
        <Link
          to={{
            pathname: `/${kind}`,
            state: {
              insertModalOpen: true,
              model: {
                week: row.week || row.number,
                season: row.season
              }
            }
          }}
        >
          <Badge color="danger">Create</Badge>
        </Link>
      );
    } else {
      return typeof cell === 'string' ? (
        <Link to={`/${kind}/${cell}`}>
          <Badge color="success">Goto</Badge>
        </Link>
      ) : (
        <Badge color="danger">No</Badge>
      );
    }
  };
};

export default generateObjColumn;
