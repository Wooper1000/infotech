import React, {useEffect} from 'react';
import {Page, ProgressCircular} from "react-onsenui";
import s from './css/Preloader.module.css'
import {useDispatch, useSelector} from "react-redux";
import {makeCall, setOrders} from "../redux/ordersReducer";
import Orders from "./Orders";
import ToolbarComponent from "./ToolbarComponent";
import SwitchPort from "./SwitchPort";

const OrdersContainer =(props) => {
    const dispatch = useDispatch()
    const orders = useSelector(state=>state.orders.orders)
        const [showOrders,setShowOrders]=React.useState('true')
    useEffect(()=>{
        dispatch(setOrders())
    },[])
    let isOrdersSet = useSelector((state)=>state.orders.ordersSet)
    return <Page>
        <ToolbarComponent setOrders={setOrders} setShowOrders={setShowOrders}/>
        {!!((isOrdersSet || orders) && showOrders) ? <Orders o={orders} makeCall={makeCall}/> : null
        }
        {!showOrders? <SwitchPort/>:<div className={s.preloader}>
            <ProgressCircular indeterminate/>
        </div>}
    </Page>

}
export default OrdersContainer

