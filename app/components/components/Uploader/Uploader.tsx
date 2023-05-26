import React from 'react';
import { Button } from '../Button';
import { type IconKeys} from '../Icon';

type UploaderProps = {
  text: string;
  to: string;
  submit: any;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  icon?: IconKeys | undefined;
  variant?:
  | 'primary'
  | 'secondary'
  | 'basic'
  | 'outline'
  | 'alert'
  | 'warning'
  | 'positive'
  | 'dropdown';
  customCss: string;
}

export const Uploader: React.FunctionComponent<UploaderProps> = ({ text, submit, to, variant, size, icon, customCss}) => {
  const startUpload = async (event: any) => {
    if (!!event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', new Blob([await file.arrayBuffer()], { type: 'image/png' }), 'file.png');
      submit(formData, {
        method: 'post',
        action: to,
        encType: 'multipart/form-data',
      });
    }
  };
  
  return <Button type="upload" text={text} startUpload={startUpload} variant={variant} size={size} icon={icon} customCss={customCss} />
};