import React from 'react';
import { Button } from '../..';

type UploadFileProps = {
  uploadFile: any;
  config: any;
};

interface FormDataValue {
  uri: string;
  name: string;
  type: string;
}

interface FormData {
  append(name: string, value: FormDataValue, fileName?: string): void;
  set(name: string, value: FormDataValue, fileName?: string): void;
}

interface FileData {
  file: FormData;
}

type ValueProps = {
  name: string;
  value: string;
} | undefined

export const UploadFileInput: React.FC<UploadFileProps> = ({ uploadFile, config }) => {
  const {
    id,
    label,
    autoComplete,
    hidden,
    icon,
    debug,
    placeholder,
    afterChange,
    validation,
    defaultValue,
    maxLength,
    required,
    mRef
  } = config;
  const [data, setData] = React.useState<ValueProps>(undefined);

  const handleChange = (data: any) => {
    setData(data);
  };
  // Refactor all this methods, remember this is only for visual purpose
  // const [file, setFile] = React.useState<FileData | null>(null);

  // const { run: upload } = uploadFile();

  // const handleUpload = async () => {
  //   await upload()
  //     .then(({ data }: any) => {
  //       console.log(data);
  //     })
  //     .catch((error: any) => {
  //       console.log(error);
  //     });
  // };

  // React.useEffect(() => {
  //   if (!!file) {
  //     console.log(file);
  //   }
  //   // console.log('running');
  //   // handleUpload();
  // }, [file]);

  const onChange = async (e: any) => {
    const data = await uploadFile(e)
    console.log('uploaded data', data)
    setData(data);
    // console.log('DATAAAA', data)
    // console.log('ONCHANGE')
    // const formData = new FormData();
    // console.log(formData);
    // const file = formData.append('file', e.target.files[0]);
    // console.log(formData);
    // console.log(file);
    // // setFile({ file: formData });
  };

  return (
    <>
      <label className="block text-sm font-medium text-neutral-800">
        {label}
      </label>
      <input type="text" value={data?.value ? data?.value : undefined} hidden={debug ? !debug : true} readOnly autoComplete='off' name={id} id={id} ref={mRef} />
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            {/* <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={onChange}
              />
            </label> */}
            <Button type="upload" text="Upload a file" startUpload={onChange} disabled={!!data && true}/>
            {/* <p className="pl-1">or drag and drop</p> */}
          </div>
          {/* <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p> */}
        </div>
      </div>
    </>
  );
};
