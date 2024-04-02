import { ToastContainer } from 'react-toastify'

function Toast() {
  return <ToastContainer pauseOnHover={false} closeOnClick={true} autoClose={1500} draggable={true} />
}

export default Toast
