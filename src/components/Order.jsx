import React from "react";
import {Button, Row, Col, Card, Icon,} from 'react-onsenui';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css'
import s from './css/Order.module.css'
import {useDispatch} from "react-redux";
import copy from "copy-to-clipboard";
import AdditionalInfo from './AdditionalInfo'


const Order = (props) => {
    const [additionalInfoVisibility, setAdditionalInfoVisibility] = React.useState(false)
    const dispatch = useDispatch()
    const makeCall = () => {
        return dispatch(props.makeCall(props.o.callKey))
    }


    return <Card modifier='material'>
        <div className={s.borderRow}>
            <Row className={s.rowPaddingBottom}>
                <Col width={'60%'}>{props.o.time.start}-{props.o.time.finish} <b>{props.o.date}</b></Col>
                {props.o.currentStatus === 'Не хватает документов' && <Col><b>НЕ ХВАТАЕТ ДОКУМЕНТОВ</b></Col>}
                <Col onClick={() => copy(props.o.contractNumber)} align="right">{props.o.contractNumber}</Col>

            </Row>
            <Row className={s.rowPaddingBottom}>
                <Col width={'90%'}>{props.o.adress}</Col>
                <Col align="right"> <Icon icon={props.o.isConnected ? 'fa-check-circle-o' : 'fa-ban'}
                                          size={26}
                                          style={{
                                              verticalAlign: 'middle',
                                              color: props.o.isConnected ? 'green' : 'red'
                                          }}
                /></Col>
            </Row>

        </div>

        {additionalInfoVisibility ?
            <Row>
                <AdditionalInfo setAdditionalInfoVisibility={setAdditionalInfoVisibility} o={props.o} makeCall={makeCall} setJobHistory={props.setJobHistory}/>
            </Row>
            :
            <Row onClick={() => setAdditionalInfoVisibility(true)}>
                <Col align='middle'>
                    <Button
                        modifier={'material--flat'}>Показать
                    </Button>
                </Col>
            </Row>
        }

    </Card>
}
export default Order;