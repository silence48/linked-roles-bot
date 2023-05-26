import React from 'react';
import clsx from 'clsx';

type SliderProps = {
  cards: React.ReactNode[];
  debug?: boolean;
};

export const Slider: React.FC<SliderProps> = ({ cards, debug = false }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [ x, setX] = React.useState(0);
  const [ scrollWidth, setScrollWidth ] = React.useState(0);
  const [ offsetWidth, setOffsetWidth ] = React.useState(0);

  React.useEffect(() => {
    if (!containerRef.current) return;
    setScrollWidth(containerRef.current?.scrollWidth)
    setOffsetWidth(containerRef.current?.offsetWidth)
  }, [])

  const updatePosition = () => {
    if (!containerRef.current) return;
    setX(containerRef.current?.scrollLeft)
  }

  const backward = () => {
    if (!containerRef.current) return;
    containerRef.current?.scroll({
      left: - offsetWidth + (scrollWidth - offsetWidth),
      behavior: 'smooth'
    })
    setX((scrollWidth - offsetWidth))
  }

  const forward = () => {
    if (!containerRef.current) return;
    containerRef.current?.scroll({
      left: offsetWidth + 200,
      behavior: 'smooth'
    })
    setX((scrollWidth - offsetWidth))
  }

  

  return (
    <div>
    <div className="relative">
      <div
        ref={containerRef}
        className="overflow-y-hidden scroll-pl-6 scroll-smooth flex w-full gap-4 snap-x snap-mandatory overflow-x-auto scrollbar-none pl-4"
        onScroll={(e) => updatePosition()}
      >
        {cards.map((card, key) => {
          return <div
            key={key}
            className="relative flex-card snap-start snap-always">
            {card}
          </div>
        })}
      </div>
      { 0 < x &&
        <button className="absolute w-[40px] h-full top-0 left-0 bg-gray-800 bg-opacity-50 border border-neutral-500" onClick={(e) => backward()}/>
      }
      { x + offsetWidth !== scrollWidth &&
        <button className="absolute w-[40px] h-full top-0 right-0 bg-gray-800 bg-opacity-50 border border-neutral-500" onClick={(e) => forward()}/>
      }
    </div>
    { debug &&
      <div className="text-neutral-800">{x} - {scrollWidth} - {offsetWidth}</div>
    }
    </div>
  )
}

