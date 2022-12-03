import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";

const initialState = {
  user: {},
  loading: false,
  error: null,
  authenticated: false,
  setting: localStorage.getItem("setting")
    ? JSON.parse(localStorage.getItem("setting"))
    : {
        balance: true,
        openingBalance: true,
        closingBalance: true,
        availableBalance: true,
        moneyReceivedChart: true,
      },
};

export const login = createAsyncThunk("loginUser", async (_, thunkAPI) => {
  try {
    const auth = getAuth();
    if (!auth.currentUser) {
      return thunkAPI.rejectWithValue(
        "Failed to authenticated, please try again."
      );
    }

    const { claims } = await auth.currentUser.getIdTokenResult();

    const user = {
      email: auth.currentUser.email,
      name: auth.currentUser.displayName,
      admin: claims.admin,
    };
    return user;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Failed to authenticated, please try again."
    );
  }
});

export const logout = createAsyncThunk("logoutUser", async (_, thunkAPI) => {
  try {
    const auth = getAuth();
    await auth.signOut();
    return {};
  } catch (error) {
    return thunkAPI.rejectWithValue("Error while logging out the user");
  }
});

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    assignSetting: (state, action) => {
      state.setting[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [login.fulfilled]: (state, { payload }) => {
      state.user = payload;
      state.authenticated = true;
      state.loading = false;
    },
    [login.rejected]: (state, { payload }) => {
      state.error = payload;
      state.authenticated = false;
    },
    [logout.fulfilled]: (state, { payload }) => {
      state.authenticated = false;
      state.user = payload;
    },
    [logout.rejected]: (state, { payload }) => {
      state.authenticated = false;
      state.user = {};
      state.error = payload;
    },
  },
});

export default authSlice.reducer;
export const { assignSetting } = authSlice.actions;
