const axios = require('axios');

export function getOrders(isForced=false,filter='active') {
    return axios.get("http://188.143.200.86:3001/get-orders",{
      params:{
          isForced,
          filter
      }
    })
}
export const call = (key)=>{
    return axios.get("http://188.143.200.86:3001/call",{
        params:{
            key
        }
    })
}
export const closeOrder = (body)=>{
    console.log(body)
    return axios.post("http://188.143.200.86:3001/close-order",body)
}









