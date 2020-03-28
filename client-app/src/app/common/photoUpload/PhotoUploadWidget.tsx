import React, { Fragment, useState, useEffect, FC } from 'react';
import { Grid, Header, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { MAIN_COLOR } from '../../constants/common';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';
import PhotoWidgetCropper from './PhotoWidgetCropper';

interface IPhotoUploadWidgetProps {
  uploadPhoto: (file: Blob) => void;
  loading: boolean;
}

const PhotoUploadWidget: FC<IPhotoUploadWidgetProps> = ({
  uploadPhoto,
  loading
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [image, setImage] = useState<Blob | null>(null);

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  });

  return (
    <Fragment>
      <Grid>
        <Grid.Column width={4}>
          <Header color={MAIN_COLOR} sub content='Step 1 - Add Photo' />
          <PhotoWidgetDropzone setFiles={setFiles} />
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color={MAIN_COLOR} content='Step 2 - Resize image' />
          {files.length > 0 && (
            <PhotoWidgetCropper
              setImage={setImage}
              imagePreview={files[0].preview}
            />
          )}
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color={MAIN_COLOR} content='Step 3 - Preview & Upload' />
          {files.length > 0 && (
            <Fragment>
              <div
                className='img-preview'
                style={{ minHeight: '200px', overflow: 'hidden' }}
              />
              <Button.Group widths={2}>
                <Button
                  disabled={!image}
                  positive
                  icon='check'
                  loading={loading}
                  onClick={() => uploadPhoto(image!)}
                />
                <Button
                  disabled={loading}
                  icon='close'
                  onClick={() => setFiles([])}
                />
              </Button.Group>
            </Fragment>
          )}
        </Grid.Column>
      </Grid>
    </Fragment>
  );
};

export default observer(PhotoUploadWidget);
