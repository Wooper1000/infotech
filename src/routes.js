import React from 'react';
import {Route,Navigate,Routes} from 'react-router-dom';
import OrdersContainer from "./components/OrdersContainer";
import SwitchPort from "./components/SwitchPort";
export const useRoutes = () => {
    return (
        <Routes>
            <Route path={'/'} element={<OrdersContainer/>} exact/>
            <Route path={'/orders'} element={<OrdersContainer/>} exact/>
            <Route path={'/switch-port'} element={<SwitchPort/>}/>
            <Route path={'*'} element={<Navigate to={'/'}/>}/>
        </Routes>
    )
}