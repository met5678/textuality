import React from 'react';
import { AutoForm } from 'uniforms-mui';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

interface AutoFormArgs<T> {
  schema: SimpleSchema;
  model: any;
  onSubmit: (editedModel: any) => void | Promise<unknown>;
}

const CustomAutoForm = <T,>(props: AutoFormArgs<T>) => {
  const { schema, model, onSubmit } = props;
  const convertedSchema = new SimpleSchema2Bridge({ schema });

  return (
    <AutoForm schema={convertedSchema} model={model} onSubmit={onSubmit} />
  );
};

export default CustomAutoForm;

export { CustomAutoForm, AutoFormArgs };

// const defaultModelTransform = (mode, model) => {
// 	const validKeys = Object.keys(model).filter(
// 		key => typeof model[key] !== 'undefined'
// 	);
// 	return validKeys.reduce((acc, key) => {
// 		acc[key] = model[key];
// 		return acc;
// 	}, {});
// };

// class CustomAutoForm extends React.Component {
// 	render() {
// 		const {
// 			schema,
// 			model,
// 			modelTransform = defaultModelTransform,
// 			onSubmit,
// 			onChange,
// 			onChangeModel,
// 			children,
// 			noSubmit,
// 			grid,
// 			formRef
// 		} = this.props;

// 		const convertedSchema = new SimpleSchema2Bridge(schema);

// 		const formProps = {
// 			schema: convertedSchema,
// 			onSubmit,
// 			onChange,
// 			onChangeModel,
// 			model,
// 			modelTransform,
// 			grid,
// 			ref: formRef,
// 			autoField: AutoField
// 		};

// 		if (noSubmit) {
// 			return (
// 				<AutoForm {...formProps}>
// 					<AutoFields autoField={AutoField} />
// 					{children}
// 				</AutoForm>
// 			);
// 		}
// 		return <AutoForm {...formProps}>{children}</AutoForm>;
// 	}
// }

// export default CustomAutoForm;
