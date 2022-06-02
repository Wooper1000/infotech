import React from "react";
import {Modal, Button, Row, Col} from "react-onsenui";
import s from './css/Order.module.css'
import config from '../common/config.json'


const UploadPhoto = (props) => {
    return <Modal isOpen={props.showModal}>
        <Row className={s.rowPaddingBottom}>
            <Col>
                <form id='form' action= {config.serverURL+`/post-photo?uid=${props.o.ticket.uid}`} method="POST" encType="multipart/form-data">
                    <input type='file' name="files" multiple/>
                    <button type='submit' onClick={()=>props.setShowCloseModalForm(false)}>Загрузить</button>
                </form>
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

export default UploadPhoto