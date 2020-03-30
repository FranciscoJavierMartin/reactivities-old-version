import React, { FC } from 'react';
import { Tab, TabProps } from 'semantic-ui-react';
import ProfilePhotos from './ProfilePhotos';
import ProfileDescription from './ProfileDescription';
import ProfileFollowing from './ProfileFollowing';

const panes = [
  {
    menuItem: 'About',
    render: () => <ProfileDescription />
  },
  {
    menuItem: 'Photos',
    render: () => <ProfilePhotos />
  },
  {
    menuItem: 'Activities',
    render: () => <Tab.Pane>Activities content</Tab.Pane>
  },
  {
    menuItem: 'Followers',
    render: () => <ProfileFollowing />
  },
  {
    menuItem: 'Following',
    render: () => <ProfileFollowing />
  }
];

interface IProfileContentProps {
  setActiveTab: (activeIndex: any) => void;
}

const ProfileContent: FC<IProfileContentProps> = ({ setActiveTab }) => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition='right'
      panes={panes}
      onTabChange={(
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        data: TabProps
      ) => setActiveTab(data.activeIndex)}
    />
  );
};

export default ProfileContent;
