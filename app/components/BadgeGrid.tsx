
// return (
//   <div className="flex flex-wrap justify-center bg-gray-800 p-4 w-full">
//   {badgeDetails.map((badge, index) => (
//    <div
//    className="flex w-full min-w-[120px] max-w-[240px] m-[1vw] sm:m-1"
//    key={index}>

// <button
// className="relative w-full bg-transparent border-none cursor-pointer overflow-hidden transition-colors duration-300 bg-cover bg-center flex items-center justify-center"
// style={{
//   backgroundImage: `url(/assets/badges/${badge.filename})`,
//   paddingTop: "100%", // This makes the aspect ratio 1:1
// }}
// onClick={() => handleBadgeClick(badge)}
// >
// <div className="absolute bottom-0 w-full p-2 text-center bg-black bg-opacity-60 text-white text-sm">
//   {badge.filename}
// </div>
// <div className="absolute top-0 left-0 w-full h-full bg-purple-500 opacity-0 z-10 hover:opacity-70 transition-opacity duration-300"></div>
// </button>


//    </div>
//   ))}
// {selectedBadge && (
// <>
//   <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setSelectedBadge(null)}></div>
//   <button
//     className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-30"
//     onClick={() => setSelectedBadge(null)}
//   >
//     ✕
//   </button>
//   <div className="fixed inset-0 flex items-center justify-center z-20">
//     <div className="bg-base-200 max-w-4/5 max-h-[80vh] flex flex-col p-4 rounded-lg">
//       <h2>{selectedBadge.filename.substring(0, 32)}</h2>
//       {isLoading ? (
//         <Spinner /> // display the spinner while isLoading is true
//       ) : Data && Data.length > 0 ? ( // only try to map over Data if it's an array with length > 0
//         <>
//           <div>
//             <table className="table w-full table-compact table-striped">
//               <thead>
//                 <tr className="bg-base-200">
//                   <th>ID</th>
//                   <th>Transaction ID</th>
//                   <th>Asset ID</th>
//                   <th>Account ID</th>
//                   <th>Balance</th>
//                   <th>Date Acquired</th>
//                   <th>Verified Ownership</th>
//                 </tr>
//               </thead>
//             </table>
//           </div>
//           <div className="overflow-auto">
//             <table className="table w-full table-compact table-striped">
//               <tbody>
//                 {Data.map((record, index) => (
//                   <tr key={index}>
//                     <td>{record.id}</td>
//                     <td>{record.tx_id}</td>
//                     <td>{record.asset_id}</td>
//                     <td>
//                       <button
//                         className="btn btn-secondary btn-md"
//                         onClick={() => handleAddressClick(record.account_id)}
//                       >
//                         {record.account_id}
//                       </button>
//                     </td>
//                     <td>{record.balance}</td>
//                     <td>{record.date_acquired}</td>
//                     <td>{record.verified_ownership}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       ) : (
//         <p>No data to display</p> // display a message if Data is an empty array
//       )}
//     </div>
//   </div>
// </>
// )}





//   </div>
// );