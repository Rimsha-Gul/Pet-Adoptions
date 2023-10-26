import { useNavigate } from 'react-router-dom'
import { Notification } from '../../types/interfaces'
import { formatNotificationTime } from '../../utils/formatNotificationTime'
import api from '../../api'
import { showErrorAlert } from '../../utils/alert'

interface NotificationCardProps {
  notification: Notification
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  const navigate = useNavigate()

  const handdleNotificationClick = async () => {
    try {
      await MarkAsRead()
      navigate(`${notification.actionUrl}`)
    } catch (error: any) {
      showErrorAlert(error.data)
    }
  }

  const MarkAsRead = async () => {
    try {
      await api.put(`/notifications/${notification.id}/read`)
    } catch (error: any) {
      if (error.response.status === 404) showErrorAlert(error.response.data)
    }
  }

  return (
    <div
      className={`p-4 cursor-pointer text-gray-600 ${
        notification.isRead
          ? 'bg-whiteCustom-10 hover:bg-gray-100'
          : 'bg-secondary-10 hover:bg-secondary-50'
      }`}
      onClick={handdleNotificationClick}
    >
      <div className="flex items-center gap-4">
        <div className="flex-none">
          <img
            src={notification.petImage}
            alt="Pet Thumbnail"
            className="w-16 h-16 object-cover rounded-lg"
          />
        </div>
        <div className="flex-auto">
          <p className="text-lg font-semibold text-gray-600">
            Status for Application ID:{' '}
            <span className="font-bold">{notification.applicationID}</span>{' '}
            updated to <span className="font-bold">{notification.status}</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {formatNotificationTime(notification.date)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotificationCard
