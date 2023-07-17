import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cartApi } from "../../api/cart-api";
import { AxiosResponse } from 'axios';
import { toastInfo } from "../../utils/toastify";

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
    isLoading: true,
};

export const fetchCartItems = () => (dispatch: Dispatch<any>) => {
    void cartApi.getALl().then((res: AxiosResponse<ICartItem[]>) => {
        if (res?.data) {
            console.log(res.data);
            dispatch(setAllCartItems(res.data));
        }
    });
};

export const removeCartItems = (cartId: number) => (dispatch: Dispatch<any>) => {
    void cartApi.removeOne(cartId).then((res: AxiosResponse<unknown[]>) => {
        if (res.status === 200) {
            toastInfo('Cart successfully removed!');
            dispatch(removeItem(cartId));
        }
    })
}

const cartSlice = createSlice({
    name: 'cartSlice',
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
        }
    },
});

export const {
    clearCart,
    removeItem,
    setAllCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;