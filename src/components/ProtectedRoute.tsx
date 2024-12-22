import React, { useMemo} from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user} = useAppContext();
  
  const routeContent = useMemo (() => {
    if (!user) {
      return <Navigate to="/login" replace/>;
    }
    return children;
  }, [user, children]);

  return routeContent;
};

export default ProtectedRoute;

