import { Navigate } from 'react-router-dom';

const LandingRedirect = () => {
  return <Navigate to="/signup" replace />;
};

export default LandingRedirect;
