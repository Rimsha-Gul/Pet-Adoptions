export const headerLinks = [
  { to: "/dashboard", label: "Profile & Settings" },
  { to: "/", label: "Logout" },
];

export const sidebarLinks = [
  {
    to: "/homepage",
    label: "Homepage",
  },
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
    to: "/addpet",
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
