import React, { useContext, useEffect } from 'react';
import { LoginContext } from '../../mainpage/contexts/LoginContextProvider';

const ProfilEditComponent = () => {

    const { userInfo } = useContext(LoginContext);

    useEffect(() => {
        console.log(userInfo);
    });

    return (
        <div>
            
        </div>
    );
};

export default ProfilEditComponent;