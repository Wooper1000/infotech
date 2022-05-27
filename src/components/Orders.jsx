import React from "react";
import Order from "./Order";
import dateFormat from "dateformat";

const Orders = (props) => {
    const sortOrders = (orders) => {
        return orders.sort((a, b) => {
            return new Date(dateFormat(a.date, "yyyy-mm-dd") + 'T' + a.time.start).getTime() < new Date(dateFormat(b.date, "yyyy-mm-dd") + 'T' + b.time.start).getTime() ? -1 : 1
        })
    }
    return sortOrders(props.o)
        .map((e,i) => {
        return <Order key={i}
                      o={props.o[i]}
                      makeCall={props.makeCall}
        />
    })
}

export default Orders