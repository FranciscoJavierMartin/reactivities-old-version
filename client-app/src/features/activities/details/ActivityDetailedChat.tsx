import React, { Fragment, useContext, useEffect } from 'react';
import { Segment, Header, Comment, Form, Button } from 'semantic-ui-react';
import { MAIN_COLOR } from '../../../app/constants/common';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { Form as FinalForm, Field } from 'react-final-form';
import { IComment } from '../../../app/models/activity';
import { Link } from 'react-router-dom';
import { PROFILE_ROUTE } from '../../../app/constants/routes';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { observer } from 'mobx-react-lite';
// TODO: Add format distance
import { formatDistance } from 'date-fns';

const ActivityDetailedChat = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    createHubConnection,
    stopHubConnection,
    addComment,
    activity
  } = rootStore.activityStore;

  useEffect(() => {
    createHubConnection(activity!.id);
    return () => {
      stopHubConnection();
    };
  }, [createHubConnection, stopHubConnection, activity]);

  return (
    <Fragment>
      <Segment
        textAlign='center'
        attached='top'
        inverted
        color={MAIN_COLOR}
        style={{ border: 'none' }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {activity &&
            activity.comments.map((comment: IComment) => (
              <Comment key={comment.id}>
                <Comment.Avatar src={comment.image || '/assets/user.png'} />
                <Comment.Content>
                  <Comment.Author
                    as={Link}
                    to={`${PROFILE_ROUTE}/${comment.username}`}
                  >
                    {comment.displayName}
                  </Comment.Author>
                  <Comment.Metadata>
                    {/*<div>{formatDistance(comment.createdAt, new Date())}</div>*/}
                    <div>{comment.createdAt.toLocaleString()}</div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.body}</Comment.Text>
                </Comment.Content>
              </Comment>
            ))}
          <FinalForm
            onSubmit={addComment}
            render={({ handleSubmit, submitting, form }) => (
              <Form onSubmit={() => handleSubmit()!.then(() => form.reset())}>
                <Field
                  name='body'
                  component={TextAreaInput}
                  rows={2}
                  placeholder='Add your comment'
                />
                <Button
                  content='Add Reply'
                  labelPosition='left'
                  icon='edit'
                  primary
                  loading={submitting}
                />
              </Form>
            )}
          />
        </Comment.Group>
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailedChat);
