import React from 'react';
import { Progress } from 'reactstrap';

const LoadingBar = ({ progress = '100' }) => (
  <Progress animated value={progress} color="info" />
);

export default LoadingBar;
