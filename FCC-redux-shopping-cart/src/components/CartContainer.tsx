import { ICartItem, ICartState, clearCart, fetchCartItems } from '../features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '../store';
import CartItem from './CartItem';
import { useEffect } from 'react';

const CartContainer = () => {
    const dispatch = useDispatch();
    const { cartItems, total }: ICartState = useSelector((store: RootState) => store.cart);

    useEffect(() => {
        store.dispatch(fetchCartItems());
    }, []);

    return (
        <>
            {cartItems.length < 1
                &&
                <section className='cart'>
                    <header>
                        <h2>your bag</h2>
                        <h4 className="empty-cart">is empty just like my soul</h4>
                    </header>
                </section>}
            {cartItems.length > 0
                &&
                <section className="cart">
                    <header>
                        <h2>your bag</h2>
                    </header>
                    <div>
                        {cartItems.map((cartItem: ICartItem) => {
                            return <CartItem key={cartItem.id} {...cartItem} />;
                        })}
                    </div>
                    <footer>
                        <hr />
                        <div className="cart-total">
                            <h4>total <span>${total}</span></h4>
                        </div>
                        <button className="btn clear-btn" onClick={() => dispatch(clearCart())}>
                            clear cart
                        </button>
                    </footer>
                </section>
            }
        </>
    );
};

export default CartContainer;