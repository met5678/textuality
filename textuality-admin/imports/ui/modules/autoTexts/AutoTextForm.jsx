import React from 'react';

import AutoTextSchema from 'schemas/autoText';

import AutoForm from 'generic/AutoForm';

const AutoTextForm = props => {
  let { model, onSubmit } = props;

  return <AutoForm schema={AutoTextSchema} onSubmit={onSubmit} model={model} />;
};

export default AutoTextForm;
