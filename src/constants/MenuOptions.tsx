export const headerLinks = [
  { to: "/editProfile", label: "Edit Profile" },
  { to: "/dashboard", label: "Dashboard", admin: true },
  { to: "/settings", label: "Settings" },
  { to: "/", label: "Logout" },
];

export const sidebarLinks = [
  {
    to: "/dashboard",
    label: "Dashboard",
  },
  {
    to: "/homepage",
    label: "Homepage",
  },
  {
    to: "/addpet",
    label: "Edit Profile",
  },
  {
    divider: true,
  },
  {
    heading: "Admin Tasks",
  },
  {
    to: "/addpet",
    label: "Add a pet",
  },
  {
    to: "/addpet",
    label: "Invite a shelter",
  },
  {
    divider: true,
  },
  {
    heading: "Settings & Privacy",
  },
  {
    to: "/settings",
    label: "Settings",
  },
  {
    divider: true,
  },
  {
    to: "/",
    label: "Logout",
  },
];
