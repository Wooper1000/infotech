import React, {useEffect} from "react";
import {Modal, Button, Row, Col, Card, ListItem,Page} from "react-onsenui";
import s from './css/Order.module.css'


const SwitchPort = (props) => {
    const [arrayOfBoxes,setArrayOfBoxes] = React.useState(null)
            useEffect( async ()=> {
                let promise = await fetch(`http://188.143.200.86:3001/all-telecom-boxes?uid=${props.uid}`)
                let data = await promise.json()
                console.log(data)
                setArrayOfBoxes(data
                        .filter(box=>box['ТипШкафа']==='ТШ')
                        .map(box => {
                        return <div>
                           <Row>
                               <Col>
                               {box['ПредставлениеОбъекта']}.
                               Подъезд {box['НомерПарадной']}. {box['ТипЭтажа'] || 'Этаж'} {box['НомерЭтажа']}.
                           </Col>
                               <Col>
                                   {box['ОБИТНомер']}. Квартиры {box['ДиапазонКвартирОт']}-{box['ДиапазонКвартирДо']}
                               </Col>
                           </Row>
                            {box['АктивноеОборудование'].map(
                                sw=>{return <Row>
                                    {sw['Наименование']}. IP: {sw['IPАдрес']}. {sw['ОБИТНомер']}
                                
                                </Row>
                                }
                            )}

                        </div>

            }))
            },[])
    return <Modal isOpen={props.showModal}>
        <div>
                <Button onClick={() =>{props.setShowSwitchModalForm(false)}}>
                    X
                </Button>
        </div>
        <div>
            {arrayOfBoxes}
        </div>
    </Modal>
}

export default SwitchPort