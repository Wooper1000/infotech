import {AlertDialog, Button, Col, Row} from "react-onsenui";
import s from "./css/Order.module.css";
import {CurrentStatus} from "./CurrentStatus";
import Configuration from "./Configuration";
import CloseOrder from "./CloseOrder";
import {closeOrder} from "../api/infotechRequests";
import React from "react";
import UploadPhoto from "./UploadPhoto";
import Telemat from "./Telemat";
import SwitchPort from "./SwitchPort";
import ClosedContracts from './ClosedContracts'

const AdditionalInfo = (props) => {
    const [showCallDialog, setShowCallDialog] = React.useState(false);
    const [showCloseModalForm, setShowCloseModalForm] = React.useState(false)
    const [showPhotoModalForm, setShowPhotoModalForm] = React.useState(false)
    const [showTelematModalForm, setShowTelematModalForm] = React.useState(false)
    const [showSwitchModalForm, setShowSwitchModalForm] = React.useState(false)
    const [showContractsModalForm, setShowContractsModalForm] = React.useState(false)
    return <div>
        <Row className={s.rowPaddingTop}>
            <Col><b>{props.o.name}</b></Col>
            <Col align={'center'}><a href={`tel:${props.o.telephone}`}>{props.o.telephone}</a><br/>
                <Button modifier="quiet" onClick={() => setShowCallDialog(true)}>
                    <AlertDialog isOpen={showCallDialog} cancelable>
                        <div className="alert-dialog-title">Позвонть абоненту?</div>
                        <div className="alert-dialog-content">
                            {props.o.adress}.<br/>Абонент: {props.o.name}
                        </div>
                        <div className="alert-dialog-footer">
                            <Button onClick={() => {
                                setShowCallDialog(false);
                                return props.makeCall()
                            }} className="alert-dialog-button">
                                Вызов
                            </Button>
                            <Button onClick={() => setShowCallDialog(false)} className="alert-dialog-button">
                                Отмена
                            </Button>
                        </div>
                    </AlertDialog>
                    Позвонить
                </Button></Col>
        </Row>
        <Row className={s.rowPaddingBottom}>
            <Col>Тип работ: {props.o.typeOfWork}</Col>
            <CurrentStatus o={props.o}/>
        </Row>
        <Row className={s.rowPaddingBottom}>
            <Col>Создал: <b>{props.o.creator}</b></Col>
        </Row>
        <Row className={s.rowPaddingBottom}>
            <Col>{props.o.comment}</Col>
        </Row>
        {props.o.ip && <Configuration config={props.o.ip}/>}

        <Row>
            <Col align='middle'>
                <Button onClick={() => setShowCloseModalForm(true)} modifier={'material'}>
                    Закрыть заявку
                </Button>
                <CloseOrder adress={props.o.adress}
                            showModal={showCloseModalForm}
                            setShowCloseModalForm={setShowCloseModalForm}
                            closeOrder={closeOrder}
                            closingForm={props.o.closingForm}
                />
            </Col>
            <Col align='middle'>
                <Button onClick={() => setShowPhotoModalForm(true)} modifier={'material'}>
                    Прикрепить фото
                </Button>
                <UploadPhoto
                    o={props.o}
                            showModal={showPhotoModalForm}
                            setShowCloseModalForm={setShowPhotoModalForm}
                />
            </Col>
            <Col align='middle'>
                <Button onClick={() => setShowTelematModalForm(true)} modifier={'material'}>
                    Заявка телематам
                </Button>
                <Telemat
                    o={props.o}
                    showModal={showTelematModalForm}
                    setShowCloseModalForm={setShowTelematModalForm}
                />
            </Col>
            <Col align='middle'>
                <Button onClick={() => setShowSwitchModalForm(true)} modifier={'material'}>
                   Показать шкафы
                </Button>
                <SwitchPort
                    uid={props.o.ticket['ФизическийАдрес'].uid}
                    showModal={showSwitchModalForm}
                    setShowSwitchModalForm={setShowSwitchModalForm}
                />
            </Col>
            <Col align='middle'>
                <Button onClick={() => setShowContractsModalForm(true)} modifier={'material'}>
                   Закрытые договора
                </Button>
                <ClosedContracts
                    uid={props.o.ticket['ФизическийАдрес'].uid}
                    showModal={showContractsModalForm}
                    setShowContractsModalForm={setShowContractsModalForm}
                />
            </Col>
        </Row>




        <Row onClick={() => props.setAdditionalInfoVisibility(false)}>
            <Col align='middle'>
                <Button modifier={'material--flat'}>Скрыть</Button>
            </Col>
        </Row>
    </div>
}

export default AdditionalInfo