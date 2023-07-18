import { Action, Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cartApi } from "../../api/cart-api";
import { AxiosResponse } from 'axios';
import { toastError, toastInfo } from "../../utils/toastify";

export interface ICartItem {
    id: number;
    title: string;
    price: number;
    img: string;
    amount: number;
}

export interface ICartState {
    cartItems: ICartItem[];
    amount: number;
    total: number;
    isLoading: boolean;
}

const intitialState: ICartState = {
    cartItems: [],
    amount: 0,
    total: 0,
    isLoading: false,
};

export const fetchCartItems = () => (dispatch: Dispatch<Action>) => {
    void cartApi.getALl().then((res: AxiosResponse<ICartItem[]>) => {
        if (res?.data) {
            console.log(res.data);
            dispatch(setAllCartItems(res.data));
        }
    });
};

export const removeCartItems = (cartId: number) => (dispatch: Dispatch<Action>) => {
    void cartApi.removeOne(cartId).then((res: AxiosResponse<unknown[]>) => {
        if (res.status === 200) {
            toastInfo('Cart successfully removed!');
            dispatch(removeItem(cartId));
        }
    });
};

// export const removeAllCartItems = (cartItems: ICartItem[]) => (dispatch: Dispatch<any>) => {
//     let count = 0;
//     cartItems.forEach(item => {
//         void cartApi.removeOne(item.id).then((res: AxiosResponse<unknown[]>) => {
//             if (res.status === 200) {
//                 count++;
//             } else {
//                 toastError('Error when removing cart item!');
//             }
//         });
//     });
//     if (count === cartItems.length) {
//         toastInfo('Clear cart success!');
//         dispatch(clearCart());
//     }
// };

export const increaseOrDecreaseCartItemAmount = (itemId: number, options: 'increase' | 'decrease') => (dispatch: Dispatch<Action>) => {
    // Load the cart item data from the API
    void cartApi.getOne(itemId).then((res: AxiosResponse<ICartItem>) => {
        if (res.status === 200) {
            const cartItem = res.data;
            // Determine whether to increase or decrease the cart item amount based on the value of `options`
            const amount = options === 'increase' ? cartItem.amount + 1 : cartItem.amount - 1;
            if (amount < 1) {
                // If the new amount is less than 1, display an error message and return
                toastError('Cart item amount cannot be less than 1!');
                return;
            }
            // Update the cart item with the new amount
            const updatedCartItem = { ...cartItem, amount };
            // Call the cart API to update the cart item
            void cartApi.updateOne(itemId, updatedCartItem).then((res: AxiosResponse<ICartItem>) => {
                if (res.status === 200) {
                    // Display a success message and dispatch the appropriate action based on the value of `options`
                    const message = options === 'increase' ? 'Increase cart item amount successfully!' : 'Decrease cart item amount successfully!';
                    toastInfo(message);
                    dispatch(options === 'increase' ? increase(updatedCartItem) : decrease(updatedCartItem));
                }
            });
        }
    });
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: intitialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
        },
        setAllCartItems: (state, action: PayloadAction<ICartItem[]>) => {
            state.cartItems = action.payload;
        },
        removeItem: (state, action: PayloadAction<number>) => {
            const cartId = action.payload;
            state.cartItems = state.cartItems.filter((item) => item.id !== cartId);
        },
        increase: (state, action: PayloadAction<ICartItem>) => {
            const cartItem = state.cartItems.find((item) => item.id === action.payload.id);
            if (cartItem) {
                cartItem.amount++;
            }
        },
        decrease: (state, action: PayloadAction<ICartItem>) => {
            const cartItem = state.cartItems.find((item) => item.id === action.payload.id);
            if (cartItem) {
                cartItem.amount--;
            }
        },
        calculateTotals: (state) => {
            let amount = 0;
            let total = 0;
            state.cartItems.forEach((item) => {
                amount += item.amount;
                total += item.amount * item.price;
            });
            state.amount = amount;
            state.total = total;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    }
});

export const {
    clearCart,
    removeItem,
    setAllCartItems,
    increase,
    decrease,
    calculateTotals,
    setLoading
} = cartSlice.actions;
export default cartSlice.reducer;