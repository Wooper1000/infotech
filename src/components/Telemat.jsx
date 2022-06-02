import React from "react";
import {Modal, Button, Row, Col, Select} from "react-onsenui";
import s from './css/Order.module.css'
import config from '../common/config.json'


const Telemat = (props) => {
    const [hObitValue, setHObitValue] = React.useState('')
    const [hIpValue, setHIpValue] = React.useState('')
    const [portsList, setPortsList] = React.useState([])
    const getPortsByObit = async (obit) => {
        let promise = await fetch(config.serverURL`/telemat/get-ports-list?obit=${obit}`)
        let ports = await promise.json()
        setHIpValue(ports['ip'])
        setPortsList(ports.ports.map((port, idx) => {
            return <option key={idx} value={port}>{port}</option>
        }))
    }
    const getPortsByIp = async (ip) => {
        let promise = await fetch(config.serverURL`/telemat/get-ports-list?ip=${ip}`)
        let ports = await promise.json()

        setHObitValue(ports['obitNum'])
        setPortsList(ports.ports.map((port, idx) => {
            return <option key={idx} value={port}>{port}</option>
        }))
    }


    const submitForm = async (e) => {
        e.preventDefault()
        let form = document.getElementById('telematForm')
        let formData = new FormData(form)
        let promise = await fetch(config.serverURL`/telemat?order1c=${props.o.jobNumber}&adressGUID=${props.o.ticket['ФизическийАдрес'].uid}`,
            {
                method: 'POST',
                body: formData
            })
        let result = await promise.json()
        alert("Заявка " + result.id)

    }

    return <Modal isOpen={props.showModal}>
        <Row className={s.rowPaddingBottom}>
            <Col>
                <form id='telematForm' onSubmit={submitForm}>
                    <Row>
                        <Col>
                            <label>Вышестоящий OBIT</label>
                        </Col>
                        <Col>
                            <input onChange={(e) => {
                                setHObitValue(e.target.value)
                            }} value={hObitValue} type='text' name="hObit" id={'hObit'} onBlur={() => {
                                let obit = document.getElementById('hObit').value
                                if (obit.length >= 5) {
                                    return getPortsByObit(obit)
                                }
                            }
                            }/>
                        </Col>

                    </Row>
                    {portsList.length !== 0 ? <Row className={s.rowPaddingBottom}>
                        <Col>
                            <select
                                id={'portsList'}
                                name='hPort'
                            >
                                {portsList}
                            </select>

                        </Col>
                    </Row> : null}

                    <Row>
                        <Col>
                            <label>Вышестоящий IP</label>
                        </Col>
                        <Col>
                            <input type='text' name="hIp" id={'hIp'} value={hIpValue}
                                   onChange={(e)=>{setHIpValue(e.target.value)}}
                                   onBlur={() => {
                                let ip = document.getElementById('hIp').value
                                if (ip.length >= 8) {                  //Нужна нормалья маска для IP
                                    getPortsByIp(ip)
                                }

                            }}/>
                        </Col>

                    </Row>

                    <Row>
                        <Col>
                            <label>Устанавливаемый OBIT</label>
                        </Col>
                        <Col>
                            <input type='text' name="nObit"/>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <label>Порт устанавливаемого</label>
                        </Col>
                        <Col>
                            <input type='text' name="nPort"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <textarea name={'comment'} placeholder={'Комментарий'}>{""}</textarea>
                        </Col>

                    </Row>


                    <button type='submit' onClick={() => props.setShowCloseModalForm(false)}>Отправить</button>
                </form>
            </Col>
        </Row>
        <Row>
            <Col>
                <Button modifier={'cta'} onClick={() => props.setShowCloseModalForm(false)}>
                    Отмена
                </Button>
            </Col>
        </Row>
    </Modal>
}

export default Telemat