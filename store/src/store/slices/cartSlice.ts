import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item } from "../../types";

const localStorageCart: string | null = localStorage.getItem("cart");
const localStorageCartParsed: Item[] = localStorageCart ? JSON.parse(localStorageCart) : [];

const initialState: { cartItems: Item[] } = {
    cartItems: localStorageCartParsed,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<Item>) {
            const newItemId: String | undefined = action.payload._id;
            const existingItem: Item | undefined = state.cartItems.find((item: Item) => item._id === newItemId);

            if (existingItem) {
                existingItem.quantity = action.payload.quantity;

                if (action.payload.quantity === 0) {
                    const indexToRemove = state.cartItems.indexOf(existingItem);
                    state.cartItems.splice(indexToRemove, 1);
                }
            } else {
                const item = { ...action.payload };
                state.cartItems.push(item);
            }

            localStorage.setItem("cart", JSON.stringify(state.cartItems));
        },

        removeItem(state, action: PayloadAction<String>) {
            state.cartItems = state.cartItems.filter((item: Item) => item._id !== action.payload);
            localStorage.setItem("cart", JSON.stringify(state.cartItems));
        },
        clearCart(state, _action: PayloadAction<void>) {
            state.cartItems = [];
            localStorage.setItem("cart", JSON.stringify(state.cartItems));
        },
    },
    selectors: {
        getCart: (state) => {
            return state.cartItems;
        },
    },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export const { getCart } = cartSlice.selectors;
export default cartSlice.reducer;
