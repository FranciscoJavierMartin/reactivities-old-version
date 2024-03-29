import React, { FC } from 'react';
import { AxiosResponse } from 'axios';
import { Message } from 'semantic-ui-react';

interface IErrorMessageProps {
  error: AxiosResponse;
  text?: string;
}

const ErrorMessage: FC<IErrorMessageProps> = ({ error, text }) => {
  return (
    <Message error>
      <Message.Header>{error.statusText}</Message.Header>
      {error.data && Object.keys(error.data.errors).length > 0 && (
        <Message.List>
          {Object.values(error.data.error)
            .flat()
            .map((err, i) => (
              <Message.Item key={i}>{err}</Message.Item>
            ))}
        </Message.List>
      )}
      {text && <Message.Content content={text} />}
    </Message>
  );
};

export default ErrorMessage;
