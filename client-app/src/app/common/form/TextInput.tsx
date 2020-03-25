import React from 'react';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';
import { FieldRenderProps } from 'react-final-form';

// TODO: Should be HTMILInputElement
interface ITextInputProps
  extends FieldRenderProps<string, HTMLElement>,
    FormFieldProps {}

const TextInput: React.FC<ITextInputProps> = ({
  input,
  width,
  type,
  placeholder,
  meta: { touched, error }
}) => {
  return (
    <Form.Field error={touched && !!error} type={type} width={width}>
      <input {...input} placeholder={placeholder} />
      {touched && error && (
        <Label basic color='red'>
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default TextInput;
