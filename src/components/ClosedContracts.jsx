import React, {useEffect} from "react";
import {Modal, Button, Row, Col, Card, ListItem, Page, Input} from "react-onsenui";
import s from './css/Order.module.css'
import config from '../common/config.json'


const ClosedContracts = (props) => {
    let uid = props.uid
    let [min,setMin] = React.useState()
    let [max,setMax] = React.useState()
let getClosedContracts = async(uid,max,min)=>{
    let promise = await fetch(config.serverURL+'/get-contracts-in-range-of-flats'+`?uid=${uid}&min=${min}&max=${max}`)
    return promise.json()
    }

    return <Modal isOpen={props.showModal} style={{
        "background-color": "rgba(0, 0, 0, 0.1)",
    }}>
        <div>
            <Button onClick={() => {
                props.setShowContractsModalForm(false)
            }}>
                X
            </Button>
            <div className={'container'}>
                <Row>
                    <Col>
<Input onChange={(e)=>setMin(e.target.value)} modifier={'material'} style={{'color':'green'}}>Начало</Input>
                    </Col>
                    <Col>
<Input onChange={(e)=>setMax(e.target.value)} modifier={'material'} style={{'color':'red'}}>Конец</Input>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Button onClick={async ()=>{
                           let flats = await getClosedContracts(uid,max,min)
                            alert(flats)
                        }}>Проверить</Button>
                    </Col>
                </Row>

            </div>

        </div>

    </Modal>
}

export default ClosedContracts