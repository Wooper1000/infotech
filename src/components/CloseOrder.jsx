import React from "react";
import {Modal, Button, Row, Col, Input, AlertDialog} from "react-onsenui";
import s from './css/Order.module.css'


const CloseOrder = (props) => {
    const [cableCount, setCableCount] = React.useState(0);
    const [showCloseAlert, setShowCloseAlert] = React.useState(false);

    let closingForm = {
        ...props.closingForm, "Материалы": [{
            "Номенклатура": "fb868ce1-4c92-11df-8906-003048c6b4ab",
            "КоличествоПлан": 0,
            "Количество": cableCount
        }]
    }
    return <Modal isOpen={props.showModal}>
        <Row>
            <Col><Input style={{textAlign: "center"}} type="text" inputId={'cable'}
                        onChange={(event) => setCableCount(event.target.value)} placeholder={"Витая пара"}/></Col>
        </Row>
        <Row className={s.rowPaddingBottom}>
            <Col>
                <Button onClick={() => setShowCloseAlert(true)}>
                    <AlertDialog isOpen={showCloseAlert} cancelable>
                        <div className="alert-dialog-title">Закрыть заявку?</div>
                        <div className="alert-dialog-content">
                            <b>{props.adress}</b>
                        </div>
                        <div className="alert-dialog-footer">
                            <Button onClick={() => {
                                setShowCloseAlert(false);
                                props.setShowCloseModalForm(false);
                                return props.closeOrder(closingForm)
                            }} className="alert-dialog-button">
                                Закрываем
                            </Button>
                            <Button onClick={() => {
                                setShowCloseAlert(false);
                                props.setShowCloseModalForm(false)
                            }} className="alert-dialog-button">
                                Отмена
                            </Button>
                        </div>
                    </AlertDialog>
                    Закрыть
                </Button>
            </Col>
        </Row>
        <Row>
            <Col>
                <Button modifier={'cta'} onClick={()=>props.setShowCloseModalForm(false)}>
                    Отмена
                </Button>
            </Col>
        </Row>
    </Modal>
}

export default CloseOrder