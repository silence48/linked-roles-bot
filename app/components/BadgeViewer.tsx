import * as React from 'react';

export const BadgeViewer = ({ data }: any) => {
    return <>
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-20"
      onClick={() => setSelectedBadge(null)}
    ></div>
    <dialog
      ref={tableModalRef}
      id="table_modal"
      className="modal modal-open backdrop-blur z-20"
    >
      <div className="modal-box w-5/6 h-4/5 flex flex-col max-w-full">
        <div className="p-2">
          <div className="flex justify-between items-center">
            <h2>{selectedBadge.filename}</h2>
            <button
              className="btn"
              onClick={() => setSelectedBadge(null)}
            >
              Close
            </button>
          </div>
        </div>
        <div className="overflow-auto flex-grow">
          {isLoading ? (
            <span className="loading loading-spinner loading-md"></span> // display the spinner while isLoading is true
          ) : data && data.length > 0 ? ( // only try to map over data if it's an array with length > 0
            <>
              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <thead>
                    <tr>
                      <th className="lg:table-cell hidden">ID</th>
                      <th className="xl:table-cell hidden">
                        Transaction ID
                      </th>
                      <th>Asset ID</th>
                      <th>Account ID</th>
                      <th className="xl:table-cell hidden">Balance</th>
                      <th className="2xl:table-cell hidden">
                        Date Acquired
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((record, index) => (
                      <tr key={index}>
                        <td className="lg:table-cell hidden">
                          {record.id}
                        </td>
                        <td className="xl:table-cell hidden">
                          {record.tx_id}
                        </td>
                        <td>{record.asset_id}</td>
                        <td>
                          <button
                            className="btn btn-secondary btn-xs"
                            onClick={() =>
                              handleAddressClick(record.account_id)
                            }
                          >
                            {record.account_id}
                          </button>
                        </td>
                        <td className="xl:table-cell hidden">
                          {record.balance}
                        </td>
                        <td className="whitespace-nowrap 2xl:table-cell hidden">
                          {record.date_acquired}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p>No data to display</p> // display a message if data is an empty array
          )}
        </div>
      </div>
    </dialog>
  </>
}