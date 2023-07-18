import { ToastContainer } from "react-toastify";
import CartContainer from "./components/CartContainer";
import NavBar from "./components/NavBar";
import 'react-toastify/ReactToastify.min.css';
import { toastInfo } from "./utils/toastify";
import { useEffect } from "react";
import { AppDispatch, RootState } from "./store";
import { calculateTotals } from "./features/cart/cartSlice";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./components/Modal";

function App() {
  const { cartItems, isLoading } = useSelector((store: RootState) => store.cart);
  const { isOpen } = useSelector((store: RootState) => store.modal);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  useEffect(() => {
    toastInfo('Welcome to Con Đường Kẹo');
  }, []);

  return (
    <>
      <Spin spinning={isLoading}>
        <main>
          {isOpen && <Modal />}
          <NavBar />
          <CartContainer />
          <ToastContainer />
        </main>
      </Spin>
    </>
  );
}

export default App;
