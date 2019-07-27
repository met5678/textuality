import React from 'react';
import AutoForm from 'uniforms-bootstrap4/AutoForm';
import AutoFields from 'uniforms-bootstrap4/AutoFields';
import AutoField from './AutoField';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';

const defaultModelTransform = (mode, model) => {
	const validKeys = Object.keys(model).filter(
		key => typeof model[key] !== 'undefined'
	);
	return validKeys.reduce((acc, key) => {
		acc[key] = model[key];
		return acc;
	}, {});
};

class CustomAutoForm extends React.Component {
	render() {
		const {
			schema,
			model,
			modelTransform = defaultModelTransform,
			onSubmit,
			onChange,
			onChangeModel,
			children,
			noSubmit,
			grid,
			formRef
		} = this.props;

		const convertedSchema = new SimpleSchema2Bridge(schema);

		const formProps = {
			schema: convertedSchema,
			onSubmit,
			onChange,
			onChangeModel,
			model,
			modelTransform,
			grid,
			ref: formRef,
			autoField: AutoField
		};

		if (noSubmit) {
			return (
				<AutoForm {...formProps}>
					<AutoFields autoField={AutoField} />
					{children}
				</AutoForm>
			);
		}
		return <AutoForm {...formProps}>{children}</AutoForm>;
	}
}

export default CustomAutoForm;
