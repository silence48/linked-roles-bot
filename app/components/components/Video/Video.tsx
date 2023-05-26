import React from 'react';

type PropsType = React.VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream
}

export const Video = ({ srcObject, ...props }: PropsType) => {
  const refVideo = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if (!refVideo.current) return
    refVideo.current.srcObject = srcObject
  }, [srcObject])

  return <video ref={refVideo} {...props} autoPlay={true} className="w-full aspect-video bg-neutral-50 border border-neutral-150 rounded-[20px]"/>
}
