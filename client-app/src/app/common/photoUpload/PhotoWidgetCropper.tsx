import React, { useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { FC } from 'react';

interface IPhotoWidgetCropperProps {
  setImage: (file: Blob) => void;
  imagePreview: string;
}

const PhotoWidgetCropper: FC<IPhotoWidgetCropperProps> = ({
  setImage,
  imagePreview
}) => {
  const cropper = useRef<Cropper>(null);
  const cropImage = () => {
    if(!(cropper.current && typeof cropper.current.getCroppedCanvas() === 'undefined')){
      cropper && cropper.current && cropper.current.getCroppedCanvas().toBlob((blob: any) => {
        setImage(blob!);
      }, 'image/jpeg');
    }
  };
  return (
    <Cropper
      ref={cropper}
      src={imagePreview}
      style={{ height: 200, width: '100%' }}
      // Cropper.js options
      aspectRatio={1 / 1}
      preview='.img-preview'
      guides={false}
      viewMode={1}
      dragMode='move'
      scalable={true}
      cropBoxMovable={true}
      crop={cropImage}
    />
  );
};

export default PhotoWidgetCropper;
