import React, { FC, useContext } from 'react';
import {
  RouteProps,
  RouteComponentProps,
  Route,
  Redirect
} from 'react-router-dom';
import { RootStoreContext } from '../stores/rootStore';
import { HOME_ROUTE } from '../constants/routes';
import { observer } from 'mobx-react-lite';

interface IPrivateRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
}

const PrivateRoute: FC<IPrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn } = rootStore.userStore;

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? <Component {...props} /> : <Redirect to={HOME_ROUTE} />
      }
    />
  );
};

export default observer(PrivateRoute);
