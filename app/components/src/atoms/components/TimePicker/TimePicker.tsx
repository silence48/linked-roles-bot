import * as React from 'react';
import clsx from 'clsx';
import { RadioGroup } from '@headlessui/react'

type TimePickerProps = {
  value?: number;
  handleChange: any;
};


const hoursOptions = [
  { name: '00', value: 0},
  { name: '01', value: 3600},
  { name: '02', value: 7200},
  { name: '03', value: 10800},
  { name: '04', value: 14400},
  { name: '05', value: 18000},
  { name: '06', value: 21600},
  { name: '07', value: 25200},
  { name: '08', value: 28800},
  { name: '09', value: 32400},
  { name: '10', value: 36000},
  { name: '11', value: 39600},
]

const minutesOptions = [
  { name: '00', value: 0},
  { name: '15', value: 900},
  { name: '30', value: 1800},
  { name: '45', value: 2700},
]

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  handleChange
}) => {

  if(!!value) {
    const minutes = (value % 3600) / 60;
    const hours = Math.floor(value / 3600)
    console.log(`Time ${('0'+hours).slice(-2)}:${('0'+minutes).slice(-2)}`);
  }
  
  const [hour, setHour] = React.useState(hoursOptions[0])
  const [minute, setMinute] = React.useState(minutesOptions[0])

  const updateData = (e: any, type: 'hour' | 'minute') => {
    if (type === 'hour') {
      setHour(e)
      const value = e.value + minute.value === 0 ? String(0) : e.value + minute.value
      handleChange({name: `${e.name} - ${minute.name}`, value})
    } else if (type === 'minute') {
      setMinute(e)
      const value = e.value + hour.value === 0 ? String(0) : e.value + hour.value
      handleChange({name: `${hour.name} - ${e.name}`, value })
    }
  }
  const getStyles = ({ active, checked, disabled}: any) => clsx(
    active ? 'ring-2 ring-offset-2 ring-secondary-400' : '',
    checked
      ? 'bg-secondary-400 border-transparent text-white hover:bg-secondary-300'
      : 'bg-neutral-50 border-neutral-200 text-neutral-900 hover:bg-neutral-50',
    'border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1'
  )
    // console.log('value', value)
  return (
    <>
    <div>
      <div className="text-neutral-800 text-paragraph-medium">
        {/* {value.hour.name} - {value.minute.name} */}
      </div>
      <div className="flex flex-row space-x-[16px]">
        <div className="grow">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-neutral-900">Hours</h2>
          </div>
          <RadioGroup
            // value={hour}
            onChange={(e: any) => updateData(e, 'hour')}
            value={hour}
            // onChange={setHour}
            className="mt-2">
            <RadioGroup.Label className="sr-only">Choose a memory option</RadioGroup.Label>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
              {hoursOptions.map((option) => (
                <RadioGroup.Option
                  key={option.name}
                  value={option}
                  className={(e) => getStyles(e)}>
                  <RadioGroup.Label as="span">{option.name}</RadioGroup.Label>
                </RadioGroup.Option>))
              }
            </div>
          </RadioGroup>
        </div>
        <div className="w-4/12">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-neutral-900">Minutes</h2>
          </div>
          <RadioGroup value={minute} onChange={(e) => updateData(e, 'minute')} className="mt-2">
            <RadioGroup.Label className="sr-only">Choose a memory option</RadioGroup.Label>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-1">
                {minutesOptions.map((option) => (
                  <RadioGroup.Option
                    key={option.name}
                    value={option}
                    className={(e) => getStyles(e)}
                  >
                    <RadioGroup.Label as="span">{option.name}</RadioGroup.Label>
                  </RadioGroup.Option>
                ))}
              </div>
          </RadioGroup>
        </div>
      </div>
    
      {/* <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-900">Minutes</h2>
      </div> */}
      
    </div>
    </>
  );
};