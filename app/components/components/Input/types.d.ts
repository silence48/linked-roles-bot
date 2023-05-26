
type InputProps = {
  type:
    | 'text'
    | 'textarea'
    | 'password'
    | 'time'
    | 'number'
    | 'email'
    | 'textarea'
    | 'select'
    | 'datepicker'
    | 'upload'
    | 'checkbox'
    | 'radiobox'
    | 'rci';
  variant?: string;
  id: string;
  autoComplete?: 'off' | 'new-password';
  label: string;
  placeholder: string;
  uploadFile?: any;
  hidden: boolean;
  disabled?: boolean;
  maxLength?: number;
  debug: boolean;
  afterChange?: (e: any) => any;
  populateOptions?: (e: any) => any;
  options?: [];
  icon?: string;
  defaultValue: string;
  belongs_to?: string;
  parentValue?: any;
  mRef?: React.RefObject<HTMLInputElement> | React.RefObject<HTMLTextAreaElement> | React.RefObject<HTMLSelectElement>;
  required: boolean;
  validation?: any;
  multiple?: boolean;
};
