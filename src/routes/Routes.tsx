import { RouteObject } from 'react-router'
import { Navigate } from 'react-router-dom'
import SignupPage from '../pages/Signup'
import LoginPage from '../pages/Login'
import VerifyEmail from '../pages/VerifyEmail'
import HomePage from '../pages/HomePage'
import PetProfile from '../pages/PetProfile'
import NotFoundPage from '../pages/PageNotFound'
import Dashboard from '../pages/Dashboard'
import AddPet from '../pages/AddPet'
import PrimaryHeader from '../layouts/PrimaryHeader'
import Sidebar from '../layouts/Sidebar'
import Settings from '../pages/Settings'
import ChangeEmail from '../pages/ChangeEmail'
import Loading from '../pages/Loading'
import ChangePassword from '../pages/ChangePassword'
import UserProfile from '../pages/UserProfile'
import AdoptionApplication from '../pages/AdoptionApplication'
import ViewApplications from '../pages/ApplicationsList'
import Application from '../pages/Application'
import InviteShelter from '../pages/InviteShelter'
import ScheduleHomeVisit from '../pages/ScheduleHomeVisit'
import ScheduleShelterVisit from '../pages/ScheduleShelterVisit'
import ShelterProfile from '../pages/ShelterProfile'
import ShelterInvitation from '../pages/ShelterInvitation'
import ResetPasswordRequest from '../pages/ResetPasswordRequest'
import ResetPassword from '../pages/ResetPassword'
import Notifications from '../pages/Notifications'

export const getRoutes = (
  isAuthenticated: boolean,
  handleLogout: () => void,
  isSidebarOpen: boolean,
  userRole: string,
  existingUser: boolean
): RouteObject[] => {
  console.log('authenticated: ', isAuthenticated)
  const adminRoutes = [InviteShelter]
  const userRoutes = [ScheduleHomeVisit]
  const adminAndShelterRoutes = [AddPet]
  const sidebarRoutes = [
    Dashboard,
    AddPet,
    Settings,
    ChangeEmail,
    ChangePassword,
    UserProfile,
    InviteShelter
  ]

  const renderProtectedRoute = (Component: any) => {
    if (isAuthenticated) {
      if (sidebarRoutes.includes(Component)) {
        // console.log("sidebar");
        if (adminAndShelterRoutes.includes(Component) && userRole === 'USER') {
          // console.log("here");
          return <NotFoundPage />
        }
        if (adminRoutes.includes(Component) && userRole !== 'ADMIN') {
          // console.log("now here");
          return <NotFoundPage />
        }
        return (
          <div className="flex">
            <Sidebar handleLogout={handleLogout} />
            <div
              className={`flex-grow items-center mt-20 md:mt-4 ${
                isSidebarOpen ? 'md:ml-64 ' : ''
              }`}
            >
              <Component />
            </div>
          </div>
        )
      } else {
        console.log(userRole)
        if (userRoutes.includes(Component) && userRole !== 'USER') {
          console.log('not user')
          return <NotFoundPage />
        } else {
          console.log('yes user')
          return (
            <div className="flex flex-col">
              <PrimaryHeader handleLogout={handleLogout} />
              <div className="">
                <Component />
              </div>
            </div>
          )
        }
      }
    }
    return <Navigate to="/" />
  }

  const renderVerifyEmail = () => {
    if (existingUser) {
      return (
        <div className="flex">
          <Sidebar handleLogout={handleLogout} />
          <div className={`flex-grow ${isSidebarOpen ? 'ml-64' : ''}`}>
            <VerifyEmail />
          </div>
        </div>
      )
    } else {
      return <VerifyEmail />
    }
  }

  const renderShelterInvitation = () => {
    return <ShelterInvitation handleLogout={handleLogout} />
  }

  return [
    { path: '/', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/loading', element: <Loading /> },
    { path: '/pagenotfound', element: <NotFoundPage /> },
    { path: '/verifyemail', element: renderVerifyEmail() },
    { path: '/homepage', element: renderProtectedRoute(HomePage) },
    { path: '/pet/:petID', element: renderProtectedRoute(PetProfile) },
    { path: '/dashboard', element: renderProtectedRoute(Dashboard) },
    { path: '/addpet', element: renderProtectedRoute(AddPet) },
    { path: '/settings', element: renderProtectedRoute(Settings) },
    { path: '/changeEmail', element: renderProtectedRoute(ChangeEmail) },
    { path: '/changePassword', element: renderProtectedRoute(ChangePassword) },
    { path: '/userProfile', element: renderProtectedRoute(UserProfile) },
    {
      path: '/adoptionApplication/:petID',
      element: renderProtectedRoute(AdoptionApplication)
    },
    { path: '/applications', element: renderProtectedRoute(ViewApplications) },
    {
      path: '/view/application/:applicationID',
      element: renderProtectedRoute(Application)
    },
    { path: '/inviteShelter', element: renderProtectedRoute(InviteShelter) },
    {
      path: '/:applicationID/scheduleHomeVisit',
      element: renderProtectedRoute(ScheduleHomeVisit)
    },
    {
      path: '/:applicationID/scheduleShelterVisit',
      element: renderProtectedRoute(ScheduleShelterVisit)
    },
    {
      path: '/shelterProfile/:shelterID',
      element: renderProtectedRoute(ShelterProfile)
    },
    {
      path: '/shelter/invitation/:invitationToken',
      element: renderShelterInvitation()
    },
    {
      path: '/resetPasswordRequest',
      element: <ResetPasswordRequest />
    },
    { path: '/resetPassword/:resetToken', element: <ResetPassword /> },
    {
      path: '/notifications',
      element: renderProtectedRoute(Notifications)
    }
  ]
}
