import React from "react";
import {AlertDialog, Col,Row} from "react-onsenui";

export const CurrentStatus = (props) => {
    const [show,setShow] = React.useState(false);
    const showHistory = ()=>{
        return setShow(true)
    }
    return <Col onClick={showHistory}>
        Статус: {props.o.currentStatus}
        <AlertDialog isOpen={show} cancelable>
            {props.o.history.map((e,i)=>{return <Row key={`note${i}`}><Col> <p>{e}</p></Col></Row>})}
        </AlertDialog>
    </Col>
}
