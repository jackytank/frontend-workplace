import { ToastContainer, toast } from "react-toastify";
import CartContainer from "./components/CartContainer";
import NavBar from "./components/NavBar";
import 'react-toastify/ReactToastify.min.css';
import { toastInfo } from "./utils/toastify";
import { useEffect } from "react";

function App() {
  useEffect(()=>{
    toastInfo('Welcome to Con Đường Kẹo')
  },[])

  return (
    <>
      <main>
        <NavBar />
        <CartContainer />
        <ToastContainer />
      </main>
    </>
  );
}

export default App;
