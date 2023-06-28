import React from 'react';
import { Link } from '@remix-run/react'

export const Card: React.FC<any> = (props: any) => {

  const badge = props.badge
  let badgeSeries = /^SSQL?0[\d]$/.test(badge.code)
    ? 'Side Quests'
    : /^SQL0\d0\d$/.test(badge.code)
    ? `SQ Learn ${badge.code.slice(-4, -2)}`
    : `Series ${badge.code.slice(2, 4)}`
  let badgeQuest = /^SSQ0[\d]$/.test(badge.code)
    ? `SSQ ${badge.code.slice(3, 5)}`
    : /^S?SQL0\d/.test(badge.code)
    ? badge.title
    : `Quest ${badge.code.slice(4, 6)}`
  
  return (
    <div className="card card-compact bg-primary-focus shadow-xl w-36 border-2 border-indigo-800 flex flex-col justify-between" style={{transition: 'transform 0.5s'}} onMouseEnter={(e) => {e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.zIndex = '10';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.zIndex = '0';}}>
      <figure className="pt-3 mb-1">
        <img src={`/assets/badges/${badge.filename}`} className="shadow-sm mx-auto h-32" alt="..." />
      </figure>
      <h2 className="card-title justify-center">{badge.code}</h2>
      <p className="text-sm text-center flex-grow">{badge.description}</p>
      {badge.owner_details &&
        
        <div className="card-actions justify-center">
        <p className="text-xs text-center flex-grow">Acquired: {badge.owner_details.date_acquired}</p>
        <a href={`https://stellar.expert/explorer/public/tx/${badge.owner_details.tx_id}`} target="_blank" rel="noopener noreferrer" className="btn btn-info btn-sm">View Tx</a>
      </div>
      }
      
    </div>
  )
}
