import { toast } from "react-toastify";


export const toastInfo = (message: string) => {
    toast.info(`${message}`, {
        position: 'top-center',
        theme: 'colored',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

export const toastError = (message: string) => {
    toast.error(`${message}`, {
        position: 'top-center',
        theme: 'colored',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};