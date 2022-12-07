import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuth } from "firebase/auth";

const initialState = {
  wallet_list: [],
  wallet_error: null,
  wallet_loading: false,
  category_list: [],
  category_error: null,
  category_loading: false,
  form: {
    edit_mode: false,
    open: false,
    selected_item: {},
    force_refetch: false,
    added_data: null,
    data_type: null,
  },
};

export const getWalletList = createAsyncThunk(
  "walletList",
  async (_, thunkAPI) => {
    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        return thunkAPI.rejectWithValue(
          "Failed to authenticated, please try again."
        );
      }

      const token = await auth.currentUser.getIdToken();

      const headers = {
        uid: auth.currentUser.uid,
        Authorization: `Bearer ${token}`,
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/wallets/balance`,
        {
          headers,
        }
      );

      if (data.success) {
        return data.data;
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Failed to fetch wallets, please try again."
      );
    }
  }
);

export const getCategoryList = createAsyncThunk(
  "categoryList",
  async (_, thunkAPI) => {
    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        return thunkAPI.rejectWithValue(
          "Failed to authenticated, please try again."
        );
      }

      const token = await auth.currentUser.getIdToken();

      const headers = {
        uid: auth.currentUser.uid,
        Authorization: `Bearer ${token}`,
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/category`,
        {
          headers,
        }
      );

      if (data.success) {
        return data.data;
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Failed to fetch categories, please try again."
      );
    }
  }
);

const globalSlice = createSlice({
  name: "globalSlice",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.form = action.payload;
      state.form.force_refetch = false;
      state.form.added_data = null;
      state.form.data_type = null;
    },
    closeModal: (state, action) => {
      state.form.edit_mode = false;
      state.form.selected_item = {};
      state.form.open = false;
      state.form.force_refetch = action.payload.force_refetch || false;
      state.form.added_data = action.payload.data || null;
      state.form.data_type = action.payload.data_type || null;
    },
  },
  extraReducers: {
    [getWalletList.pending]: (state) => {
      state.wallet_error = null;
      state.wallet_loading = true;
    },
    [getWalletList.fulfilled]: (state, { payload }) => {
      state.wallet_list = payload;
      state.wallet_loading = false;
    },
    [getWalletList.rejected]: (state, { payload }) => {
      state.wallet_error = payload;
      state.wallet_loading = false;
    },

    [getCategoryList.pending]: (state) => {
      state.category_error = null;
      state.category_loading = true;
    },
    [getCategoryList.fulfilled]: (state, { payload }) => {
      state.category_list = payload;
      state.category_loading = false;
    },
    [getCategoryList.rejected]: (state, { payload }) => {
      state.category_error = payload;
      state.category_loading = false;
    },
  },
});

export default globalSlice.reducer;

export const { openModal, closeModal } = globalSlice.actions;
