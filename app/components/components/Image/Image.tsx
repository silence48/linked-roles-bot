import React from 'react';
import clsx from 'clsx';

type ImageProps = {
  imageUrl: string;
  customCss?: string;
  width?: string;
  height?: string;
  fullHeight?: boolean;
};

export const Image: React.FC<ImageProps> = ({ imageUrl, customCss, width, height, fullHeight = false }) => {
  const style = clsx(
    'bg-cover bg-center w-full h-full object-center object-cover',
    `${customCss}`
  );

  return (
    <div className={`w-[200px] ${fullHeight ? 'h-full' : 'h-[200px]'}`}>
      {/* <Tween
        animation={{ blur: '0px', duration: 1000 }}
        style={{ filter: 'blur(30px)' }}
      > */}
        <img style={{ height: `${height}px`, width: `${width}px`}} className={style} src={imageUrl} alt=""/>
      {/* </Tween> */}
    </div>
  );
};
