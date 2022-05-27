import React,{useState} from 'react';
import {Button,Modal} from 'react-bootstrap'
import {AlertDialog} from "react-onsenui";


export const MakeCall = (props)=>{

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const makeCall=()=>{
        props.makeCall(props.callKey)
    }
    setShow(props.show)
    return (
        <AlertDialog isOpen={show} cancelable>
            <div className="alert-dialog-title">Позвонть абоненту?</div>
            <div className="alert-dialog-content">
                {props.adress}.<br/>Абонент: {props.name}
            </div>
            <div className="alert-dialog-footer">
                <Button onClick={makeCall} className="alert-dialog-button">
                    Вызов
                </Button>
                <Button onClick={handleClose} className="alert-dialog-button">
                    Отмена
                </Button>
            </div>
        </AlertDialog>

    );
}
