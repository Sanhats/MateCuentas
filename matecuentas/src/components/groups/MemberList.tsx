'use client'

import { GroupMember } from '@/lib/api'
import { FaCrown, FaClock } from 'react-icons/fa'

interface MemberListProps {
  members: GroupMember[]
  creatorEmail: string
}

export default function MemberList({ members, creatorEmail }: MemberListProps) {
  return (
    <ul className="space-y-2">
      {members.map((member) => (
        <li 
          key={member.id} 
          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            {member.email === creatorEmail && (
              <FaCrown className="text-yellow-500 mr-2" title="Creador del grupo" />
            )}
            <span className="text-madera">{member.email}</span>
          </div>
          <div className="flex items-center">
            {member.status === 'pending' ? (
              <span className="flex items-center text-yellow-600 text-sm">
                <FaClock className="mr-1" />
                Pendiente
              </span>
            ) : (
              <span className={`ml-2 px-3 py-1 rounded-full text-white text-xs ${
                member.role === 'admin' ? 'bg-yerba' : 'bg-madera'
              }`}>
                {member.role === 'admin' ? 'Administrador' : 'Miembro'}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

