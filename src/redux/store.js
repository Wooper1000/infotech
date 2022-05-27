import {applyMiddleware, combineReducers, createStore} from "redux";
import thunkMiddleware from "redux-thunk"
import {ordersReducer} from "./ordersReducer";




let reducers = combineReducers({
orders:ordersReducer
})

let store = createStore(reducers, applyMiddleware(thunkMiddleware));

export default store;