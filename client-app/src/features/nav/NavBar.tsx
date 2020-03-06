import React from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';

interface INavBarProps{
  openCreateFrom: () => void;
}

const NavBar:React.FC<INavBarProps> = ({
  openCreateFrom,
}) => {
  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header>
          <img src='/assets/logo.png' alt='logo' style={{
            marginRight: '10px'
          }}/>
          Reactivities
        </Menu.Item>
        <Menu.Item name='Activities' />
        <Menu.Item >
          <Button onClick={openCreateFrom} positive content='Create activity'/>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default NavBar;
