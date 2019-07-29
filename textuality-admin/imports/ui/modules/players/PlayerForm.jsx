import React from 'react';

import PlayerSchema from 'schemas/player';

import AutoForm from 'generic/AutoForm';

const PlayerForm = props => {
  let { model, onSubmit } = props;

  return <AutoForm schema={PlayerSchema} onSubmit={onSubmit} model={model} />;
};

export default PlayerForm;
