import { createSlice } from "@reduxjs/toolkit";

export interface CartItem {
    id: number;
    title: string;
    price: number;
    img: string;
    amount: number;
}

export interface CartState {
    cartItems: CartItem[];
    amount: number;
    total: number;
    isLoading: boolean;
}

const intitialState: CartState = {
    cartItems: [],
    amount: 0,
    total: 0,
    isLoading: true,
};

const cartSlice = createSlice({
    name: 'cartSlice',
    initialState: intitialState,
    reducers: {},
});

export default cartSlice.reducer;