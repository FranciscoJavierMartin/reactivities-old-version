import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react';

interface ILoadingComponentProps{
  inverted?: boolean;
  content?: string;
}

const LoadingComponent:React.FC<ILoadingComponentProps> = ({
  inverted = true,
  content,
}) => {
  return (
    <Dimmer active inverted={inverted}>
      <Loader content={content}/>
    </Dimmer>
  )
}

export default LoadingComponent;