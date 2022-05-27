import React from "react";
import OrdersContainer from "./OrdersContainer";
import {
    setOrders,
    makeCall,
    sortOrders,
    setRecievedOrders
} from "../redux/ordersReducer";
import {connect} from "react-redux";

class OrdersContainerClass extends React.Component{
    componentDidMount(){
this.props.setOrders()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.orders.length!==this.props.orders.length) {
            this.props.sortOrders(this.props.orders);
        }
    }
    render(){
        return <>
<OrdersContainer orders={this.props.orders} setJobHistory={this.props.setJobHistory} call={this.props.makeCall} sortOrders={this.props.sortOrders}/>
            </>
    }
}

let mapStateToProps = (state)=> {
    return {
        orders : state.orders.orders,
    }
}
export default connect(mapStateToProps,{setOrders,makeCall,sortOrders,setRecievedOrders})(OrdersContainerClass)