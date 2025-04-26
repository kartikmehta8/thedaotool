import {
  Signup,
  Login,
  Dashboard,
  Landing,
  BusinessProfile,
  ContractorProfile,
} from '../pages';

export const routes = [
  { path: '/', element: <Landing />, isPrivate: false },
  { path: '/login', element: <Login />, isPrivate: false },
  { path: '/signup', element: <Signup />, isPrivate: false },
  { path: '/dashboard', element: <Dashboard />, isPrivate: true },
  { path: '/profile/business', element: <BusinessProfile />, isPrivate: true },
  {
    path: '/profile/contractor',
    element: <ContractorProfile />,
    isPrivate: true,
  },
  { path: '/payment-history', element: null, isPrivate: true },
];
