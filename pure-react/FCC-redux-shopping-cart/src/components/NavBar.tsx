import { CartIcon } from '../icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ICartState } from '../features/cart/cartSlice';



const NavBar = () => {
  const { amount }: ICartState = useSelector((state: RootState) => state.cart);

  return (
    <>
      <nav>
        <div className="nav-center">
          <h3>Con đường kẹo</h3>
          <div className="nav-container">
            <CartIcon />
            <div className="amount-container">
              <p className="total-amount">{amount}</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
