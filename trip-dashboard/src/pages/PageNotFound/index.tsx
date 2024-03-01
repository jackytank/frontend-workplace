import { HvButton } from '@hitachivantara/uikit-react-core';
import { useNavigate, useLocation } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();

    const locations = useLocation();

    const handleBack = () => {
        navigate('/');
    };

    return (
        <>
            <h2>404 Page Not Found</h2>
            <p>
                {locations.pathname} not found
            </p>
            <p>
                <HvButton onClick={handleBack}>
                    Back To Home Page
                </HvButton>
            </p>
        </>
    );
};

export default PageNotFound;