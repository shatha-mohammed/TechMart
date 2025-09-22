import { apiServices } from '../../services/api';
import { Product } from "@/src/interfaces"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async () => {
    const { data } = await apiServices.getAllProducts();
    return data;
  }
);

const initialState: { products: Product[] } = {
  products: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProducts.pending, () => {
      console.log("Pending");
    });

    builder.addCase(getAllProducts.rejected, () => {
      console.log("Rejected");
    });

    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      console.log("Fulfilled");
      state.products = action.payload;
    });
  },
});

export const productsReducer = productsSlice.reducer;