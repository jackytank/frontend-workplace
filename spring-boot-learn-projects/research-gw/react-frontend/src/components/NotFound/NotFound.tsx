import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import { constants } from '../../constants/constants';

const NotFound = () => {
    return (
        <>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={(
                    <Button
                        type="primary"
                    >
                        <Link to={constants.ROUTING.HOME}>Back Home</Link>
                    </Button>
                )}
            />
        </>
    );
};

export default NotFound;