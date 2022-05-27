import React from "react";
import {Col, List, ListItem, Row,Button} from "react-onsenui";
import copy from 'copy-to-clipboard'
import s from './css/Order.module.css'
 const Configuration =(props)=>{
    return <Row>
       <Col>
            <List
                dataSource={props.config}
                renderRow={(row, idx) => (
                    row.ip.length>0 ? <ListItem key={`IP${idx}`}>
                        <Row>
                            <Col><b>{row['ServiceName']}:</b></Col>
                        </Row>

                        <Row className={s.rowPaddingBottom}>
                           <Col onClick={() => {copy(row.ip[0].ip)}}><Button>{row.ip[0].ip}</Button></Col>
                        </Row>
                        <Row>
                            <Col>{row.ip[0].mask}</Col>
                        </Row>
                        <Row>
                            <Col>{row.ip[0].gw}</Col>
                        </Row>
                        <Row>
                            <Col>{row.ip[0].dns[0]}</Col>
                        </Row>
                        <Row>
                            <Col>{row.ip[0].dns[1]}</Col>
                        </Row>
                    </ListItem> : null
                )}
            />
        </Col>
       <Col>
            <List
                dataSource={props.config}
                renderRow={(row, idx) => {
                   return row['smartLogin'] ?
                       <ListItem key={`IP${idx}`}>
                           <Row className={s.rowPaddingBottom}>
                               <Col><b>{row['ServiceName']}</b></Col>
                           </Row>
                           <Row>
                               <Col>{row['smartLogin']}</Col>
                               <Col>{row['smartPassword']}</Col>
                           </Row>
                       </ListItem>
                       : null
                       // <ListItem key={`ip${idx}`}>
                       //     <Row>
                       //         <Col>{row['ServiceName']}</Col>
                       //     </Row>
                       //     <Row>
                       //         <Row><Col>{e.ip}</Col></Row>
                       //         <Row><Col>{e.mask}</Col></Row>
                       //         <Row><Col>{e.gw}</Col></Row>
                       //         <Row><Col>{e.dns[0]}</Col></Row>
                       //         <Row><Col>{e.dns[1]}</Col></Row>
                       //     </Row>
                       //     } )}
                       // </ListItem>
                }}
            />
        </Col>
    </Row>
}
export default Configuration