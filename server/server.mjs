import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dateFormat from "dateformat";
import fs from 'fs'
import base64 from "./base64.mjs";
import requestConfig from '../config/config.json' assert {type: "json"}
import orders from '../config/ordersList.json' assert {type: "json"}
import instance from "./middleware/axios.middlewarem.mjs";
import requests from "./requests.mjs";
import multer from 'multer'
import PhotoUploader from "./photoUploader.mjs";


const app = express()
const port = 3001;
app.get('/', (req, res) => {
    res.send('Сервачок на компе!')
})


app.use(express.json())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

let ordersList = orders;

const {
    getJobHistory,
    getOrderIP,
    getOrders,
    call,
    getTickets,
    getJobList,
    getJobListUpdate,
    getReport,
    closeOrder,
} = {...requests}
app.use(cors());


const authorizeRequest = (f, options = {}, cfg1 = requestConfig.withCookie, cfg2 = requestConfig.withAuth) => {
    {
        console.log("Использован установленный сейшен: " + requestConfig.withCookie.headers.Cookie)
        return f(options, cfg1)
            .then(resp => resp.data)
            .catch(err => {
                console.log("Ошибку обработал")
                return f(options, cfg2)
                    .then(resp => {
                        requestConfig.withCookie.headers.Cookie = resp.headers['set-cookie'][0].split(';')[0]
                        fs.writeFileSync('../config/config.json', JSON.stringify(requestConfig))
                        console.log("Получен новый сейшен: " + requestConfig.withCookie.headers.Cookie)
                        return (resp.data)
                    })
            })
    }
}

const setCurrentOrders = async () => {
    let orders = await requests.getJobList();
    ordersList = await responseHandler(orders)
    fs.writeFileSync('../config/ordersList.json', JSON.stringify(ordersList));
    console.log('Принудительно обновлено')
    return ordersList
}
setInterval(async () => {
    console.log("Зашёл сюда")
    let hours = new Date().getHours()
    return await setCurrentOrders()
}, 600000)

const formatDateAndTime = (value, type = 'Time') => {
    return type === "date" ? dateFormat(value, "yyyy-mm-dd") : dateFormat(value, "HH:MM")
}
const filterOrders = (orders, filter) => {
    switch (filter) {
        case  "all":
            return orders
        case "active" :
            return orders
                .filter(e => {
                    if (e.currentStatus === 'В очереди' || e.currentStatus === "В работе" || e.currentStatus === "Не хватает документов" || e.currentStatus === 'На сборку') return true
                })
        case 'finished' :
            return orders
                .filter(e => {
                    if (e.currentStatus === 'Работы выполнены') return true
                })
        case 'returned' :
            return orders
                .filter(e => {
                    if (e.currentStatus === 'Не хватает документов') return true
                })
    }
}
const responseHandler = async (path) => {
    let response = [];
    for (const [i, order] of path.entries()) {
        let history = await getJobHistory(path[i]['Номер']);
        let ticket = await getTickets(path[i]['РегистрационныйНомерВСистемеИсточникеЗаявки'])
        let ipAdress = await getOrderIP(path[i]['РегистрационныйНомерВСистемеИсточникеЗаявки']);
        let services = ticket ? ticket.Services : null
        response.push({
            adress: path[i]['Адрес'],                                                      //Запрос списка заявок
            date: formatDateAndTime(path[i]['ПланДатаНачала'], "date"),
            time: {
                start: formatDateAndTime(path[i]['ПланВремяНачала']),
                finish: formatDateAndTime(path[i]['ПланВремяОкончания'])
            },
            contractNumber: path[i]['НомерДоговора'],
            isConnected: !!path[i]['АдресБылПодключенРанее'],
            telephone: path[i]['КонтактныеДанные'][0] ? path[i]['КонтактныеДанные'][0]['Телефон'] : 'Без телефона',
            ip: ipAdress.result === "success" ? ipAdress : false,
            typeOfWork: path[i]['ТипРабот'],
            comment: path[i]['ДополнительнаяИнформация'],
            creator: path[i]['Ответственный'].Name,
            currentStatus: path[i]['ТекущийСтатус'],
            jobNumber: path[i]['Номер'],
            name: path[i]['Контрагент'],
            callKey: (+(path[i]['Номер'].slice(4) + "01")).toString(),
            history: history.map(e => e['Комментарий']),
            equipment: path[i]['Товары'] ? path[i]['Товары'] : false,
            services: path[i]['Услуги'],
            ticket: path[i],

        })
    }
    return response
}

app.get('/get-orders', async (req, res) => {
    if (req.query.isForced === 'true') await setCurrentOrders()
    res.send(filterOrders(ordersList, req.query.filter))

})
app.get('/call', async (req, res) => {
    let result = await authorizeRequest(call, req.query.key)
    res.send(result.Answer)
})
app.get('/get-report', async (req, res) => {
    let report = await getReport(req.query.start,req.query.finish,req.query.variant)
    let buff = new Buffer(report, 'base64');
    let text = buff.toString('utf8');
    res.send(text.split('{16,')[20].split(',')[4].replace(/[^0-9]/g, ""))
})


// app.get('/get-report',async (req,res,next=authReq) => {
//  try {
//      let promise = await instance.post('Reports/Get', {
//          "id": "c2f0ef93-c513-11ea-b976-005056b57a2d",
//          "param": {
//              "Filter": [],
//              "Params": [
//                  {
//                      "id": "d98ea70f-c5d9-4c44-9808-7d98f9971031",
//                      "use": true,
//                      "value": {
//                          "Variant": "Этотмесяц",
//                          "StartDate": '2022.03.01',
//                          "EndDate": '2022.03.31'
//                      }
//                  }
//              ]
//          }
//      })
//  }
//
//  catch (e){
//      console.log(e)
//      //next()
//  }
//  })

app.post('/close-order', async (req, res) => {
    let result = await authorizeRequest(closeOrder, req.body);
    console.log(req.body)
    res.send({msg: "Хуй"})

})
app.get('/show-equipment', async (req, res) => {
    await setCurrentEquipment()
    res.send(allEquipment
        .filter(e => {
            return req.query.type ? e["Номенклатура"].Type === req.query.type : true
        })
    )
})
const upload = multer({
    dest: "./photos"
});


app.post('/post-photo', upload.array('files', 10), async (req, res) => {
let uid = req.query.uid
    let result = await PhotoUploader.uploadPhotos(req.files,uid)
        console.log(result)
        res.send({msg:`${result.length} ФОТОСЫ ЗАГРУЖЕНЫ`})
})


app.post('/telemat', upload.none(), async (req, res) => {
    let hwswitch = await getSwitchDescriptionByObit(req.body.nObit)
    let hwmodel = hwswitch.Name
    let hwip = await getIpByObit(req.body.nObit)
    let switchip = await getIpByObit(req.body.hObit)
    let newSwitch = {
        obitnum: req.body.nObit,
        hwmodel,
        hwip,
        hwuplink: req.body.nPort
    }

    let highSwitch = {
        switchip,
        switchport: req.body.hPort,
        switchobitnum: req.body.hObit
    }
    let data = {
        lastmile: "",
        data: [{
            obitnum: 'OBIT-' + newSwitch.obitnum,
            hwmodel: newSwitch.hwmodel,
            hwip: newSwitch.hwip,
            hwuplink: newSwitch.hwuplink,
            switchip: highSwitch.switchip,
            switchport: highSwitch.switchport,
            switchobitnum: 'OBIT-' + highSwitch.switchobitnum
        }],
        radio: 0,
        optic: 0,
        ether: 0,
        comment: req.body.comment ? req.body.comment : ""
    }
    let telematRequestBody = {
        id: 0,
        tickettype: 3,
        order1c: `${req.query.order1c}`,
        data: JSON.stringify(data),
        AddressGUID: req.query.adressGUID,
        sourceid: "f71850b6-60ee-d72b-2e07-55ee500f95b5",  //рандомно
        delayed: false
    }
    console.log(telematRequestBody)
    let promise = await instance.post('/vobit/create', telematRequestBody)
    console.log(promise.data.Answer)
    res.json(promise.data.Answer)
})

const getIpByObit = async (obit) => {
    let promise = await instance.get(`/netobject/telem_srv?act=get_ip&port=1&obitnumber=OBIT-${obit}`)
    return promise.data.Answer.split('\n')[0]
}
const getPortsByIp = async (ip) => {
    let promise = await instance.get(`/netobject/get_sw_ports?ip=${ip}`)
    return promise.data.Answer //Массив портов
}
const getSwitchDescriptionByObit = async (obit) => {
    let promise = await instance.get(`/trade/getequipment?ObitSN=OBIT-${obit}`)
    return promise.data.Answer
}
const getSwitchPortsReportByObit = async (obit) => {
    let promise = await instance.get(`/netobject/telem_srv?act=get_sw_report&obitnumber=OBIT-${obit}`)
    return JSON.parse(promise.data.Answer)
}
const getSwitchByIp = async (ip) => {
    let promise = await instance.get(`/netobject/eqfind?ip=${ip}`)
    return promise.data.Answer.length > 0 ? promise.data.Answer : null
}
const getContractsStatus = async (arrayOfContracts) => {
    let promise = await instance.post(`/home/contractstatus`, arrayOfContracts)
    return promise.data.Answer
}
// const getClientsByAddress = async (address) => {
//     let promise = await instance.post(`/GetClientsByAddress/get`,apiClient, address)
//     return promise.data.Answer
// }

const getClientsByAddress = async (address) => {
    let promise = await instance.post(`https://ext.obit.ru/crm/hs/extaccess/GetClientsByAddress/get`, address)
    return promise.data.Answer
}
const getAddressUid = async (uid) => {

    let promise = await instance.post(`/addresses/getbyphaddress?full&uid=${uid}`).catch(err=>console.log('Ошибка получения UID',uid))
    return {
        uid: promise.data['Список'][0]['Ссылка'],
        name: promise.data['Список'][0]['Наименование'],
        street: promise.data['Список'][0]['Улица'],
        home: promise.data['Список'][0]['Дом'],
        additionalInfo: promise.data['Список'][0]['ДопДанные'],
    }
}
const getContractsByAddress = async (uid, flat) => {
    let address = {
        "Договор": "",
        "АдресАрендодателя": {
            "uid": uid.uid.toString(),
            "Code": "",
            "Name": uid.name.toString()
        },
        "АдресУлица": uid.street.toString(),
        "АдресДом": uid.home.toString(),
        "АдресЛитера": uid.additionalInfo.find(element => {
            return element['Тип'] === 'Литера'
        }) ? uid.additionalInfo.find(element => {
            return element['Тип'] === 'Литера'
        })['Значение'] : '',
        "АдресКорпус": uid.additionalInfo.find(element => {
            return element['Тип'] === 'Корпус'
        }) ? uid.additionalInfo.find(element => {
            return element['Тип'] === 'Корпус'
        })['Значение'] : '',
        "АдресКвартира": flat.toString()
    }
    let promise = await getClientsByAddress(address)

    return promise
}
app.get('/telemat/get-ports', async (req, res) => {
    let ip = await getIpByObit(req.query.obit)
    let ports = await getPortsByIp(ip)
    let portsDescription = await getSwitchPortsReportByObit(req.query.obit)
    let contracts = []
    for (const [key, value] of Object.entries(portsDescription)) {
        contracts.push(value.contract ? value.contract : "")
    }
    let contractsStatus = await getContractsStatus({contracts: contracts})
    ports = ports.map((port, idx) => {
        return {
            port: port,
            description: portsDescription[port],
            status: contractsStatus.find((e) => e['Договор'] === portsDescription[port].contract)
        }
    })
    res.send(ports)

})
app.get('/telemat/get-ports-list', async (req, res) => {
    let ip = req.query.obit ? await getIpByObit(req.query.obit) : req.query.ip
    let ports = await getPortsByIp(ip)
    let obitNum = await getSwitchByIp(ip)
    if (obitNum) {
        obitNum = obitNum[0]['ОБИТНомер'].split('OBIT-')[1]
    }
    let result = {
        ports,
        obitNum: obitNum ? obitNum : req.query.obit,
        ip
    }
    console.log(result)
    res.send(result)
})
app.get('/all-telecom-boxes', async (req, res) => {
    let promise = await instance.post('netobject/getbyphisadruid', {
        'pauids': req.query.uid
    })
    let allInfo = promise.data.Answer
    res.send(allInfo)

})
app.get('/test', async (req, res) => {
    let promise = await getSwitchDescriptionByObit(req.query.obit)
    res.send(promise)
})
app.get('/test2', async (req, res) => {
    let promise = await getSwitchByIp(req.query.ip)
    res.send(promise)
})

app.get('/get-contracts-in-range-of-flats', async (req, res) => {
    let min = req.query.min
    let max = req.query.max
    let physUid = req.query.uid
    let uid = await getAddressUid(physUid)
    const flatsRange = []
    for (let i = min;i<=max;i++){
        flatsRange.push(i)
    }
    const findClosedContracts = async (flat, uid) => {
        return new Promise((resolve, reject) => {
            getContractsByAddress(uid,flat).then(contracts => {
                if(contracts) {
                    let isCableAvailable = !!(contracts.length && !contracts.filter(contract => {return (contract['Значение']['Status'] === 'Активен')}).length)
                    let isActive = !! contracts.filter(contract => {
                        return (contract['Значение']['Status'] === 'Активен')
                    }).length
                    if (contracts.length) {
                        resolve({
                            msg: `В ${flat} было ${contracts.length} договоров. Линия ${isActive ? 'активна' : 'отключена'}`,
                            isActive,
                            isCableAvailable,flat
                        })
                    } else if (contracts) {
                        resolve({msg: `В ${flat} не было договора`, isActive,isCableAvailable,flat})
                    } else reject(`Ошибочка вышла во время запроса квартиры ${flat}`)
                }
                else reject('Ошибка запросов')
            })
        }).catch(err=>console.log(`Ошибочка вышла во время запроса квартиры ${flat}`))
    }

    let promises = []
    flatsRange.forEach(flat => {
        promises.push(findClosedContracts(flat,uid))
    })
    Promise.all(promises).then(resolves => {
        res.json(resolves)
    })
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

let a = () => {
    setTimeout(() => console.log('хуй'), 2000)
}
export default authorizeRequest



