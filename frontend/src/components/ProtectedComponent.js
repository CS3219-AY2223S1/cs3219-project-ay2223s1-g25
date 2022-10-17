import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Loading from './Loading';


const ProtectedComponent = ({ component, ...propsForComponent}) => {
    const Cp = withAuthenticationRequired(component, {
        onRedirecting: () => <Loading />,
      });
    return <Cp {...propsForComponent} />
}

export default ProtectedComponent;