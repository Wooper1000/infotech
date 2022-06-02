import config from '../common/config.json'
const axios = require('axios');


export function getOrders(isForced=false,filter='active') {
    return axios.get(config.serverURL+"/get-orders",{
      params:{
          isForced,
          filter
      }
    })
}
export const call = (key)=>{
    return axios.get(config.serverURL+"/call",{
        params:{
            key
        }
    })
}
export const closeOrder = (body)=>{
    console.log(body)
    return axios.post(config.serverURL+"/close-order",body)
}









