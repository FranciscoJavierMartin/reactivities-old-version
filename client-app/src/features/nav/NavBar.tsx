import React, { useContext } from 'react';
import { Menu, Container, Button, Dropdown, Image } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { PROFILE_ROUTE } from '../../app/constants/routes';
import { observer } from 'mobx-react-lite';

interface INavBarProps {}

const NavBar: React.FC<INavBarProps> = () => {
  const rootStore = useContext(RootStoreContext);
  const { user, logout } = rootStore.userStore;
  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header as={NavLink} exact to='/'>
          <img
            src='/assets/logo.png'
            alt='logo'
            style={{
              marginRight: '10px'
            }}
          />
          Reactivities
        </Menu.Item>
        <Menu.Item name='Activities' as={NavLink} to='/activities' />
        <Menu.Item>
          <Button
            as={NavLink} to='/createActivity' 
              positive
            content='Create activity'
          />
        </Menu.Item>
        {user &&
          <Menu.Item position='right'>
            <Image avatar spaced='right' src={user.image || '/assets/user.png'}/>
            <Dropdown pointing='top left' text={user.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={`/${PROFILE_ROUTE}/${user.username}`} text='My profile' icon='user'/>
                <Dropdown.Item onClick={logout} text='Logout' icon='power'/>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        }
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
