import React, {useEffect} from "react";
import {Modal, Button, Row, Col,Input,AlertDialog,Icon,Card} from "react-onsenui";
import s from './css/Order.module.css'
import config from '../common/config.json'



const ClosedContracts = (props) => {
    let uid = props.uid
    let [min,setMin] = React.useState()
    let [max,setMax] = React.useState()
    let [flatList,setFlatList]=React.useState([])
    let [toastVisible,setToastVisible]=React.useState(false)
let getClosedContracts = async()=>{
    let promise = await fetch(config.serverURL+'/get-contracts-in-range-of-flats'+`?uid=${uid}&min=${min}&max=${max}`)
    let flats = await promise.json()
    setFlatList(flats)
    setToastVisible(true)
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
                        <Button onClick={getClosedContracts}>Проверить</Button>
                    </Col>
                </Row>
                <Card isOpen={toastVisible} >
                    <div>
                    {/*    <div style={{'margin':'20px'}}>*/}
                    {/*        <div>*/}
                    {/*            <Row><Col>Доступны квартиры: {flatList.map(flat=>{ if (flat.isCableAvailable){ return flat.flat}})}</Col></Row>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    */}
                        {flatList.map(flat=>{
                            switch (flat.isActive){
                                case false:return <Row>
                                <Col>
                                    <p style={{'color':flat.isCableAvailable?'red':'grey'}}>{flat.msg}</p>
                                </Col>
                                    <Col><Icon icon={flat.isCableAvailable?'fa-check-circle-o':'fa-ban'}
                                               size={26}
                                               style={{
                                                   verticalAlign: 'middle',
                                                   color:flat.isCableAvailable?'green':'red'
                                               }}
                                    /></Col>
                                </Row>
                                case true :return <Row>
                                    <Col>
                                    <p style={{'color':'green'}}>{flat.msg}</p>
                        </Col>
                            <Col><Icon icon={'fa-ban'}
                                       size={26}
                                       style={{
                                           verticalAlign: 'middle',
                                           color:'red'
                                       }}
                            /></Col>
                        </Row>
                                default : {}
                            }
                        })
                        }
                    </div>
                </Card>

            </div>

        </div>

    </Modal>
}

export default ClosedContracts