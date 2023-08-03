export const headerLinks = [
  { to: "/applications", label: "View Applications" },
  { to: "/userProfile", label: "Profile & Settings" },
  { to: "/", label: "Logout" },
];

export const sidebarLinks = [
  {
    to: "/userProfile",
    label: "Profile",
  },
  {
    divider: true,
    admin: true,
    shelter: true,
  },
  {
    heading: "Admin Tasks",
    admin: true,
  },
  {
    heading: "Shelter Tasks",
    shelter: true,
  },
  {
    to: "/addpet",
    label: "Add a pet",
    admin: true,
    shelter: true,
  },
  {
    to: "/inviteShelter",
    label: "Invite a shelter",
    admin: true,
  },
  {
    divider: true,
  },
  {
    heading: "Settings & Privacy",
  },
  {
    label: "Settings",
    options: [
      {
        to: "/changeEmail",
        label: "Change Email",
      },
      {
        to: "/changePassword",
        label: "Change Password",
      },
    ],
  },
  {
    divider: true,
  },
  {
    to: "/",
    label: "Logout",
  },
];
