import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface CartState {
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
    name: 'jCart',
    initialState: intitialState,
    reducers: {},
});

export default cartSlice.reducer;