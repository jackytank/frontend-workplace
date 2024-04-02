import { PropsWithChildren } from 'react';
import { Route } from 'react-router-dom';

// type Props = {
//   children?: PropsWithChildren
//   props: any
// }

function Auth({ children, ...props }: PropsWithChildren) {
    return <Route {...props}>{children}</Route>;
}

export default Auth;
