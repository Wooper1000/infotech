import {getOrders,call} from "../api/infotechRequests";
const SET_ORDERS="SET_ORDERS"


let initialState = {
    orders:[]
}
export const ordersReducer = (state=initialState,action)=>{
switch (action.type) {
    case 'SET_ORDERS':{
    return {
        orders:[...action.orders],
        ordersSet : true
    }
}
        default: return state
}
}

export const setRecievedOrders = (orders)=> {
    return {
        type: SET_ORDERS,
        orders
    }
}
export const setOrders = (isForced,filter) =>async (dispatch)=>{
    let orders = await getOrders(!!isForced,filter)
   console.log(orders.data);
    localStorage.setItem('orders',JSON.stringify(orders.data))
    dispatch(setRecievedOrders(orders.data))

}
export const makeCall = (key) => async (dispatch)=>{
   let result = await call(key)
    console.log(result)
}
