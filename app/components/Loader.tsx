import React from 'react';

type LoaderProps = {};

export const Loader: React.FC<LoaderProps> = () => {
  const isBrowser = typeof window !== "undefined"
  const lottieContainer = React.useRef<HTMLDivElement>(null);;
  // There is a bug in React 18 that creates a second animation below.
  React.useEffect(() => {
    if (!!isBrowser) {
      const w: any = window
      if (w.bodymovin){
        w.bodymovin.loadAnimation({
          container: lottieContainer.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'https://assets10.lottiefiles.com/packages/lf20_phmllabo.json'
        })
      }
    }
  }, [])

  return (
    <div className="flex justify-center mb-[20px]">
      <div ref={lottieContainer} className="w-[200px] h-[200px]"></div>
    </div>
  );
};
