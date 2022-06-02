import React from 'react';
import {ProgressCircular, Toolbar, ToolbarButton, Icon,Modal,Button,Row,Col} from "react-onsenui";
import p from './css/Order.module.css'
import {useDispatch} from "react-redux";
import config from '../common/config.json'


const ToolbarComponent = (props) => {

    const getSalary = async ()=>{
        let promise= await fetch(config.serverURL+'/get-report')
        let salary = await promise.json()
        alert(salary)
    }

    // <option key={idx} value={port.port} style={{color:port.description.status==='DOWN'?'red':'green'}}>{port.port} {port.description.status} (
    //     {port.description.obithome ? port.description.obithome.split('кв. ')[1].split('(')[0]:null}) {port.status?port.status['Статус']:null}</option>

    const dispatch = useDispatch()
    const forceUpdate = async ()=>{setForceUpdatingInProgress(true); await dispatch(props.setOrders('force'));setForceUpdatingInProgress(false)};
    const [isForceUpdatingInProgress,setForceUpdatingInProgress]=React.useState(false)
    const [isFilterListOpen,setFilterListOpen]=React.useState(false)

    return  <Toolbar className={`${p.rowPaddingBottom} ${p.notAbsolute}`}>
        <div className="center" style={{color:'orange','fontWeight':'bold'}}>
            Инфотех
        </div>
        <div className="left">
            <ToolbarButton onClick={forceUpdate}>
                { isForceUpdatingInProgress? <ProgressCircular indeterminate/> :  <Icon icon="ion-ios-sync" />}
            </ToolbarButton>
        </div>
        <div className="right">
            <ToolbarButton onClick={()=>setFilterListOpen(true)}>
                <Icon icon="ion-ios-menu" />
                <Modal isOpen={isFilterListOpen} onClick={()=>setFilterListOpen(false)}>
                    <Row><Col><Button onClick={()=>{props.setShowOrders(true);dispatch(props.setOrders(null,'active'))}}>Активные</Button></Col></Row>
                    <Row><Col><Button onClick={()=>{props.setShowOrders(true);dispatch(props.setOrders(null,'finished'))}}>Завершенные</Button></Col></Row>
                    <Row><Col><Button onClick={()=>{props.setShowOrders(true);dispatch(props.setOrders(null,'returned'))}}>Не хватает документов</Button></Col></Row>
                    <Row><Col><Button onClick={getSalary}>Заказать отчёт</Button></Col></Row>
                    <Row><Col><Button onClick={()=>{
return props.setShowOrders(false)
                    }}>Информация по свитчу</Button></Col></Row>
                </Modal>

            </ToolbarButton>
        </div>
    </Toolbar>


}
export default ToolbarComponent

