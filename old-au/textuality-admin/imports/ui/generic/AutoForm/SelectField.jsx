import React from 'react';
import autobind from 'autobind-decorator';
import Select from 'react-select';
import connectField from 'uniforms/connectField';
import { FormGroup, Label, Button } from 'reactstrap';

class SelectField extends React.Component {
	@autobind
	onChange(items) {
		if (this.props.multi) {
			if (!items) items = [];
			this.props.onChange(items.map(item => item.value));
		} else {
			if (!items) this.props.onChange(null);
			else {
				this.props.onChange(items.value);
			}
		}
	}

	render() {
		let {
			name,
			label,
			value,
			options,
			multi,
			addAll,
			grid,
			disabled,
			field
		} = this.props;

		if (!options && field.allowedValues) {
			if (Array.isArray(field.allowedValues)) {
				options = field.allowedValues;
			} else if (typeof field.allowedValues === 'function') {
				options = field.allowedValues();
			}
		}

		options = options.map(opt => {
			if (typeof opt === 'number') return { value: opt, label: String(opt) };
			if (typeof opt === 'string') return { value: opt, label: opt };
			return opt;
		});

		if (multi) {
			value = options.filter(
				opt => Array.isArray(value) && value.includes(opt.value)
			);
		} else {
			value = options.find(opt => opt.value === value);
		}

		return (
			<FormGroup required={!field.optional} row={!!grid}>
				<Label className={grid && 'col-' + grid + ' col-form-label'}>
					{label}
				</Label>
				<Select
					name={name}
					value={value}
					options={options}
					onChange={this.onChange}
					isMulti={multi}
					className={'mb-1' + grid ? 'col-' + (12 - grid) : ''}
					isClearable={!!field.optional}
					isDisabled={disabled}
				/>
				{addAll && (
					<Button
						onClick={() => this.onChange(options)}
						color="secondary"
						size="sm"
					>
						Add All
					</Button>
				)}
			</FormGroup>
		);
	}
}

export default connectField(SelectField);
