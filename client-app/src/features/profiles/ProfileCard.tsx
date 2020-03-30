import React, { FC } from 'react';
import { Card, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { PROFILE_ROUTE } from '../../app/constants/routes';
import { IProfile } from '../../app/models/profile';

interface IProfileCardProps {
  profile: IProfile;
}

const ProfileCard: FC<IProfileCardProps> = ({ profile }) => {
  return (
    <Card as={Link} to={`/${PROFILE_ROUTE}/${profile.username}`}>
      <Image src={profile.image || '/assets/user.png'} />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
      </Card.Content>
      <Card.Content extra>
        <div>
          <Icon name='user' />
          {`${profile.followersCount} followers`}
        </div>
      </Card.Content>
    </Card>
  );
};

export default ProfileCard;
