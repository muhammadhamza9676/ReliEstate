import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;

// Persistent Store
// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice";
// import userReducer from "./slices/userSlice";
// import propertyReducer from "./slices/propertySlice";
// import storage from "redux-persist/lib/storage"; // LocalStorage
// import { persistReducer, persistStore } from "redux-persist";
// import { combineReducers } from "redux";

// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["auth"], // Persist only auth state
// };

// const rootReducer = combineReducers({
//   auth: persistReducer(persistConfig, authReducer),
//   user: userReducer,
//   property: propertyReducer,
// });

// const store = configureStore({
//   reducer: rootReducer,
// });

// export const persistor = persistStore(store);
// export default store;
