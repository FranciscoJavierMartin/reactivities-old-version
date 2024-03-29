import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';
import { DateTimePicker } from 'react-widgets';

// TODO: Should be HTMLInputElement
interface IDateInputProps extends FieldRenderProps<Date, HTMLElement>, FormFieldProps {
  id?: string | undefined;
}

const DateInput: React.FC<IDateInputProps> = ({
  input,
  width,
  placeholder,
  date = false,
  time = false,
  meta: touched,
  error,
  ...rest
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <DateTimePicker
        placeholder={placeholder}
        value={input.value || null}
        onChange={input.onChange}
        onBlur={input.onBlur}
        onKeyDown={(event: React.KeyboardEvent<any>) => event.preventDefault()}
        date={date}
        time={time}
        {...rest}
      />
      {touched && error && (
        <Label basic color='red'>
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default DateInput;
