import {
  Signup,
  Login,
  Dashboard,
  Landing,
  OrganizationProfile,
  ContributorProfile,
} from '../pages';

export const routes = [
  { path: '/', element: <Landing />, isPrivate: false },
  { path: '/login', element: <Login />, isPrivate: false },
  { path: '/signup', element: <Signup />, isPrivate: false },
  { path: '/dashboard', element: <Dashboard />, isPrivate: true },
  {
    path: '/profile/organization',
    element: <OrganizationProfile />,
    isPrivate: true,
  },
  {
    path: '/profile/contributor',
    element: <ContributorProfile />,
    isPrivate: true,
  },
  { path: '/payment-history', element: null, isPrivate: true },
];
