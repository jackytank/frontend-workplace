import { CartIcon, Testing } from '../icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { CartState } from '../features/cart/cartSlice';



const NavBar = () => {
  const { amount }: CartState = useSelector((state: RootState) => state.cart);

  return (
    <>
      <nav>
        <div className="nav-center">
          <h3>Redux toolkit</h3>
          <div className="nav-container">
            <CartIcon />
            <div className="amount-container">
              <p className="total-amount">{amount}</p>
            T</div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
