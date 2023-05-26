import React from 'react';
import { Cell } from '../Cell';
type TableProps = {
  header: string[];
  data: [
    {
      value: string | any;
      type: 'simple'
      | 'link'
      | 'description'
      | 'extended'
      | 'button'
      | 'badge'
      | 'icon'
      | 'dropdown'
      | 'person'
      | 'image';
    }
  ][];
  background?: 'default' | 'light';
  component?: React.ElementType;
  customCss?: string;
};

export const Table: React.FC<TableProps> = ({ header, data, component, background = 'default', customCss }) => {

  return (
    <>
      {data.length !== 0 ? (
        <div className={`flex flex-col ${customCss}`}>
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-neutral-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className={`${ background === 'default' ? 'bg-neutral-100' : 'bg-neutral-150'}`}>
                    <tr>
                      {header.map((item, key) => {
                        return (
                          <th
                            key={key}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                          >
                            {item}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200"> 
                    {data.map((row, key) => {
                      return (
                        <tr key={key}>
                          {row.map((column, key) => {
                            return (
                              <td
                                className={`${ background === 'default' ? 'bg-neutral-100' : 'bg-neutral-150'} text-neutral-800 whitespace-nowrap h-[64px]`}
                                key={key}
                              >
                                <Cell type={column.type} value={column.value} component={component} />
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};
