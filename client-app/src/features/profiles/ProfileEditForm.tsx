import React, { FC } from 'react';
import { combineValidators, isRequired } from 'revalidate';
import { Form as FinalForm, Field } from 'react-final-form';
import { IProfile } from '../../app/models/profile';
import { Form, Button } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';

const validate = combineValidators({
  displayName: isRequired('displayName')
});

interface IProfileEditFormProps {
  updateProfile: (profile: IProfile) => void;
  profile: IProfile;
  finishEditMode: () => void;
}

const ProfileEditForm: FC<IProfileEditFormProps> = ({
  updateProfile,
  profile,
  finishEditMode
}) => {
  return (
    <FinalForm
      onSubmit={updateProfile}
      validate={validate}
      initialValues={profile!}
      render={({ handleSubmit, invalid, pristine, submitting }) => (
        <Form
          onSubmit={() => handleSubmit()!.then(() => finishEditMode())}
          error
        >
          <Field
            name='displayName'
            component={TextInput}
            placeholder='Display name'
            value={profile!.displayName}
          />
          <Field
            name='bio'
            component={TextAreaInput}
            rows={3}
            placeholder='Bio'
            value={profile!.bio}
          />
          <Button
            loading={submitting}
            floated='right'
            disabled={invalid || pristine}
            positive
            content='Update profile'
          />
        </Form>
      )}
    ></FinalForm>
  );
};

export default ProfileEditForm;
