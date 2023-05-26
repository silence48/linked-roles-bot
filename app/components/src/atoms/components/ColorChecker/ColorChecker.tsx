import React from 'react';
import { hexToRgb, getColorObject, calculateRatio, rgbToHsb, hsbToRgb, rgbToHex } from './utils';
import { Button } from '..';

type ColorCheckerProps = {};

export const ColorChecker: React.FC<ColorCheckerProps> = ({}) => {
  const [ colorOne, setColorOne ] = React.useState('ffffff');
  const [ colorTwo, setColorTwo ] = React.useState('ffffff');
  const [ ratio, setRatio ] = React.useState<null | string>(null);

  React.useEffect(() => {
    const c1 = hexToRgb(colorOne);
    const c2 = hexToRgb(colorTwo);
    const r = calculateRatio(c1, c2).toFixed(2)
    setRatio(r)
    // if (parseInt(r) > 1) {
    //   console.log('greater')
    // } else {
    //   if (!c2) return;
    //   console.log('not greater')
    //   const { r, g , b } = c2
    //   const { h, s , b: brightness} = rgbToHsb(r, g, b)
    //   const newB = brightness * 0.33
    //   const newC = hsbToRgb(h,s,newB)
    //   console.log(newC)
    //   const newR = calculateRatio(c1, newC).toFixed(2)
    //   console.log('iRatio', newR, parseFloat(newR), parseFloat(newR) > 7)
    //   if (parseFloat(newR) > 7) {
    //     console.log('is Greater')
    //     // const newH = rgbToHex(newC)
    //     const newH = rgbToHex(newC?.r, newC?.g, newC?.b)
    //     console.log('newH', parseInt(newH).toString())
    //     setColorTwo(parseInt(newH).toString())
    //     setRatio(newR)
    //   }
    // }

  }, [colorOne, colorTwo])

  const fixContrast = () => {
      const c1 = hexToRgb(colorOne);
      const c2 = hexToRgb(colorTwo);
      if (!c2) return;
      const { r, g , b } = c2
      const { h, s , b: brightness} = rgbToHsb(r, g, b)
      const newB = brightness * 0.33
      const newC = hsbToRgb(h,s,newB)
      const newR = calculateRatio(c1, newC).toFixed(2)
      if (parseFloat(newR) > 7) {
        const newH = rgbToHex(newC?.r, newC?.g, newC?.b)
        setColorTwo(parseInt(newH).toString())
        setRatio(newR)
      }
    }

  return (
    <div className="text-neutral-800">
      <div>Ratio: {ratio}</div>
      <div>Color 1: {colorOne}</div>
      <div>Color 2: {colorTwo}</div>
      <Button text="fix contrast" onClick={() => fixContrast()}/>


      <div className="w-[200px] h-[200px]" style={{backgroundColor: `#${colorOne}`}}>
        <div style={{color: `#${colorTwo}`}}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi vero sequi similique ullam, accusamus architecto cumque delectus quae, quo odio, vel rerum repellat?
        </div>
      </div>
    </div>
  );
};
