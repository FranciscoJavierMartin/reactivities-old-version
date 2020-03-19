import React from 'react';
import {
  FormFieldProps,
  Form,
  Label,
  Select,
  DropdownProps
} from 'semantic-ui-react';
import { FieldRenderProps } from 'react-final-form';

// TODO: Should be HTMLSelectElement
interface IProps
  extends FieldRenderProps<string, HTMLElement>,
    FormFieldProps {}

const SelectInput: React.FC<IProps> = ({
  input,
  width,
  options,
  placeholder,
  meta: { touched, error }
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <Select
        value={input.value}
        onChange={(
          event: React.SyntheticEvent<HTMLElement, Event>,
          data: DropdownProps
        ) => input.onChange(data.value)}
        placeholder={placeholder}
        options={options}
      />
      {touched && error && (
        <Label basic color='red'>
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default SelectInput;
