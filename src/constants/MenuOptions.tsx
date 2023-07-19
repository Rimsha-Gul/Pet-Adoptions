export const headerLinks = [
  { to: "/applications", label: "View Applications" },
  { to: "/userprofile", label: "Profile & Settings" },
  { to: "/", label: "Logout" },
];

export const sidebarLinks = [
  {
    to: "/userprofile",
    label: "Profile",
  },
  {
    divider: true,
    admin: true,
  },
  {
    heading: "Admin Tasks",
    admin: true,
  },
  {
    to: "/addpet",
    label: "Add a pet",
    admin: true,
  },
  {
    to: "/inviteshelter",
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
