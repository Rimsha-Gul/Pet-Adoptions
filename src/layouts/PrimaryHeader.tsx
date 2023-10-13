import { useContext, useEffect, useRef, useState } from 'react'
import PrimaryLogo from '../icons/PrimaryLogo'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { headerLinks } from '../constants/MenuOptions'
import { BsFillBellFill } from 'react-icons/bs'
import { NotificationsContext } from '../context/NotificationsContext'
import socket from '../socket/socket'

interface HeaderProps {
  handleLogout: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const PrimaryHeader = ({ handleLogout }: HeaderProps) => {
  const appContext = useContext(AppContext)
  const userName = appContext.displayName
  const userEmail = localStorage.getItem('userEmail')

  const { unseenCount } = useContext(NotificationsContext)

  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isUserOptionsOpen, setIsUserOptionsOpen] = useState<boolean>(false)
  const [userProfilePhoto, setUserProfilePhoto] = useState(
    appContext.profilePhoto
  )

  // update local state when context values are updated
  useEffect(() => {
    setUserProfilePhoto(appContext.profilePhoto)
  }, [appContext.profilePhoto])

  const handleUserOptionsClick = () => {
    setIsUserOptionsOpen(!isUserOptionsOpen)
  }

  const handleLinkClick = (path: string) => {
    setIsUserOptionsOpen(false)
    if (path === '/') {
      handleLogout({} as React.MouseEvent<HTMLButtonElement>)
    } else {
      navigate(path)
    }
  }

  // Handler for clicking outside dropdown menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserOptionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleBellClick = () => {
    socket.emit('mark_notifications_as_seen', userEmail)
    navigate('/notifications')
  }

  return (
    <div className="fixed top-0 w-full flex items-center justify-between p-4 shadow-md mb-12 z-20 bg-white">
      <PrimaryLogo />
      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          <BsFillBellFill
            className="text-primary text-3xl cursor-pointer"
            onClick={handleBellClick}
          />
          {unseenCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
              {unseenCount}
            </span>
          )}
        </div>
        <div className="relative">
          {userProfilePhoto ? (
            <img
              data-cy="profile-photo"
              src={userProfilePhoto}
              alt="Profile Photo"
              className="w-14 h-14 rounded-full cursor-pointer text-sm border-2 border-secondary shadow-md"
              onClick={handleUserOptionsClick}
            />
          ) : (
            <button
              data-cy="profile-photo"
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 border-2 border-secondary shadow-md"
              onClick={handleUserOptionsClick}
            >
              <span className="text-gray-500 text-lg font-medium">
                {userName.charAt(0)}
              </span>
            </button>
          )}
          {isUserOptionsOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-6 w-48 bg-white border border-gray-300 rounded shadow"
            >
              <div className="px-4 py-2 border-b border-gray-300">
                <p className="text-md font-medium">{userName}</p>
              </div>
              <div className="flex flex-col px-4 py-2">
                {headerLinks.map((link, index) => (
                  <button
                    data-cy={`${link.label
                      .toLowerCase()
                      .replace(/&/g, 'and')
                      .replace(/ /g, '-')}-link`}
                    key={index}
                    className="mb-2 text-md text-gray-600 hover:text-primary text-left"
                    onClick={() => handleLinkClick(link.to)}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PrimaryHeader
