import { ChevronDown, ChevronUp } from "../icons";
import { increaseOrDecreaseCartItemAmount, removeCartItems } from "../features/cart/cartSlice";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";

interface CartItemProps {
  id: number;
  img: string;
  title: string;
  price: number;
  amount: number;
}

const CartItem = ({ id, img, title, price, amount }: CartItemProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <article className="cart-item">
      <img src={img} alt={title} />
      <div>
        <h4>{title}</h4>
        <h4 className="item-price">${price}</h4>
        <button className="remove-btn" onClick={() => dispatch(removeCartItems(id))}>remove</button>
      </div>
      <div>
        <button className="amount-btn" onClick={() => dispatch(increaseOrDecreaseCartItemAmount(id, 'increase'))}>
          <ChevronUp />
        </button>
        <p className="amount">{amount}</p>
        <button className="amount-btn" onClick={() => {
          if (amount === 1) {
            dispatch(removeCartItems(id));
            return;
          }
          dispatch(increaseOrDecreaseCartItemAmount(id, 'decrease'));
        }}>
          <ChevronDown />
        </button>
      </div>
    </article>
  );
};

export default CartItem;