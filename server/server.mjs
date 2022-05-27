import axios from "axios"
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dateFormat from "dateformat";
import fs from 'fs'
import requestConfig from '../config/config.json'  assert {type: "json"}
import orders from '../config/ordersList.json' assert {type: "json"}

//import equipment from '../config/equipment.json'
import requests from "./requests.mjs";
import multer from 'multer'
import authReq from './middleware/authorizeRequests.js'
import { log } from "console";


const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

//app.use(bodyParser.urlencoded({extended: true}));
let ordersList = orders;
//let allEquipment = equipment;
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
    postPhoto
} = {...requests}
app.use(cors());
const port = 3001;
app.get('/', (req, res) => {
    res.send('Сервачок на компе!')
})

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
    let orders = await authorizeRequest(requests.getJobList);
    ordersList = await responseHandler(orders)
    fs.writeFileSync('../config/ordersList.json', JSON.stringify(ordersList));
    console.log('Принудительно обновлено')
    return ordersList
}
// const setCurrentEquipment = async () => {
//     let promise = await authorizeRequest(requests.getEquipmentByOrders);
//     allEquipment = await promise.Answer
//     fs.writeFileSync('../config/equipment.json', JSON.stringify(equipment));
//     console.log('Оборудка записана')
// }
// (async () => await setCurrentEquipment())()
//(async ()=>await setCurrentOrders())()
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
const responseHandler = async (resp) => {
    let path = resp.Answer
    let response = [];
    for (const [i, order] of path.entries()) {
        let history = await authorizeRequest(getJobHistory, path[i]['Номер']);
        let ticket = await authorizeRequest(getTickets, path[i]['РегистрационныйНомерВСистемеИсточникеЗаявки'])
        let ipAdress = await authorizeRequest(getOrderIP, path[i]['РегистрационныйНомерВСистемеИсточникеЗаявки']);
        let services = ticket.Answer.Ticket ? ticket.Answer.Ticket.Services : null
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
            ip: ipAdress.Answer.result === "success" ? ipAdress.Answer.data : false,
            typeOfWork: path[i]['ТипРабот'],
            comment: path[i]['ДополнительнаяИнформация'],
            creator: path[i]['Ответственный'].Name,
            currentStatus: path[i]['ТекущийСтатус'],
            jobNumber: path[i]['Номер'],
            name: path[i]['Контрагент'],
            callKey: (+(path[i]['Номер'].slice(4) + "01")).toString(),
            history: history.Answer.map(e => e['Комментарий']),
            equipment: path[i]['Товары'] ? path[i]['Товары'] : false,
            services: path[i]['Услуги'],
            ticket: path[i],
            closingForm: {
                "ПометкаУдаления": false,
                "Комментарий": "",
                "РаботыВыполнены": true,
                "ДокументыПолучены": false,
                "ДокументыПодписаны": false,
                "ЗаборОборудования": false,
                "ЗатраченоМинут": 0,
                "ОтложенноеПодключение": false,
                "ВыполнениеПодтверждено": true,
                "ПриостановкаСМоментаПодключения": false,
                "ТегиЗаявки": "",
                "Заявка": path[i].uid,
                "БлагонадежностьСтатус": "00000000-0000-0000-0000-000000000000",
                "БлагонадежностьКомментарий": "",
                "Работы": path[i]['Услуги'].map(e => {
                    return {
                        "Номенклатура": e['НоменклатураUID'],
                        "КоличествоПлан": 1,
                        "Количество": e['Количество'],
                        "Перенос": false,
                        "Высотные": false,
                        "Ночные": false,
                        "Демонтаж": false
                    }
                }),
                "Материалы": [],
                "Оборудование": [],
                "Услуги": [
                    {
                        "НомерУслугиЗаявки": 1,
                        "Наименование": services ? services.map((e) => {
                            e['Свойство'].Name
                        }).join(' ') : null,
                        "Подключена": true,
                        "Причина": "",
                        "Дополнительная": false,
                        "appserviceid": 0
                    }
                ],
                "ДополнительныеЗаявки": [],
                "ДополнительныеУслуги": []
            }
        })
    }
    //response[response.length - 1].ticket = resp;
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
    let result = await authorizeRequest(getReport,
        {
            start: req.query.start,
            finish: req.query.finish,
            variant: req.query.variant

        }
    );
    let buff = new Buffer(result.Answer, 'base64');
    let text = buff.toString('utf8');
    res.send(text.split('{16,')[20].split(',')[4].replace(/[^0-9]/g, ""))
})
const instance = axios.create({
    baseURL: "https://ext.obit.ru/crm/hs/extaccess/",
    headers: {
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/octet-stream",
        MobAppName: "0JjQvdGE0L7QotC10YUNCg==",
        MobAppVersion: "0.3.82",
        'User-Agent': '1C+Enterprise/8.3',
        Host: 'ext.obit.ru',
        Connection: 'keep-alive',
        IBSession: 'start',
        Authorization: 'Basic 0KjQsNCx0LDQvdGB0LrQuNC50JTQkjphV0hSQ09scjh6'
    }
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
const base64 = (text) => {
    return new Buffer(text).toString('base64')
}

app.post('/post-photo', upload.array('files', 10), async (req, res) => {
    console.log(req.query.uid)
    for (let photo of req.files) {
        let data = fs.createReadStream(photo.path)
        let result = await axios.post('https://ext.obit.ru/crm/hs/extaccess/files/uploadbin', data, {
            headers: {
                'Content-Disposition': `filename=${base64(photo.originalname)}`,                                //имя файла в base64
                'CRM-uidOwner': req.query.uid,                  //uid заявки
                'CRM-FileName': base64(photo.originalname),                                  //не понятно образованное имя в Base64
                'CRM-typeOwner': '0L7QsdC40YLQl9Cw0Y/QstC60LDQndCw0KDQsNCx0L7RgtGLDQo=', //не меняется
                'CRM-filetype': 'NDc1MzAzYTgtODc3MS0xMWU0LTgzMWYtMDAzMDQ4YzZiNGFiDQo=',  //не меняется
                'IBSession': 'start',
                'Authorization': 'Basic 0KjQsNCx0LDQvdGB0LrQuNC50JTQkjphV0hSQ09scjh6',
                "Accept-Encoding": "gzip, deflate, br",
                "Content-Type": "application/octet-stream",
                'MobAppName': "0JjQvdGE0L7QotC10YUNCg==",
                'MobAppVersion': "0.3.82",
                'User-Agent': '1C+Enterprise/8.3',
                'Host': 'ext.obit.ru',
                'Connection': 'keep-alive',
            }
        })
        console.log(result.data.ReturnText)
        if (result.data.ReturnCode !== 0) {
            res.json({msg: result.data.ReturnText})
        }
    }
    res.sendStatus(200)
})
app.post('/telemat',upload.none(), async (req, res) => {
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
            obitnum: 'OBIT-'+newSwitch.obitnum,
            hwmodel:newSwitch.hwmodel,
            hwip:newSwitch.hwip,
            hwuplink:newSwitch.hwuplink,
            switchip:highSwitch.switchip,
            switchport:highSwitch.switchport,
            switchobitnum:'OBIT-'+highSwitch.switchobitnum
        }],
        radio: 0,
        optic: 0,
        ether: 0,
        comment: req.body.comment ? req.body.comment : ""
    }
    let telematRequestBody = {
        id:0,
        tickettype: 3,
        order1c:`${req.query.order1c}`,
        data:JSON.stringify(data),
        AddressGUID:req.query.adressGUID,
        sourceid:"f71850b6-60ee-d72b-2e07-55ee500f95b5",  //рандомно
        delayed: false
    }
    console.log(telematRequestBody)
    let promise = await instance.post('/vobit/create',telematRequestBody)
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
const getSwitchPortsReportByObit= async (obit)=>{
    let promise = await instance.get(`/netobject/telem_srv?act=get_sw_report&obitnumber=OBIT-${obit}`)
    return JSON.parse(promise.data.Answer)
}
const getSwitchByIp = async (ip)=>{
    let promise = await instance.get(`/netobject/eqfind?ip=${ip}`)
    return promise.data.Answer.length > 0 ? promise.data.Answer : null
}
const getContractsStatus = async (arrayOfContracts)=>{
    let promise = await instance.post(`/home/contractstatus`,arrayOfContracts)
    return promise.data.Answer
}
app.get('/telemat/get-ports', async (req, res) => {
    let ip = await getIpByObit(req.query.obit)
    let ports = await getPortsByIp(ip)
    let portsDescription = await  getSwitchPortsReportByObit(req.query.obit)
    let contracts = []
    for (const [key, value] of Object.entries(portsDescription)) {
        contracts.push(value.contract?value.contract:"")
    }
let contractsStatus = await getContractsStatus({contracts:contracts})
    ports = ports.map((port,idx)=>{
        return {
            port:port,
            description:portsDescription[port],
            status:contractsStatus.find((e)=>e['Договор']===portsDescription[port].contract)
        }
    })
    res.send(ports)

})
app.get('/telemat/get-ports-list', async (req, res) => {
    let ip =req.query.obit ? await getIpByObit(req.query.obit) : req.query.ip
    let ports = await getPortsByIp(ip)
    let obitNum = await getSwitchByIp(ip)
    if(obitNum){
        obitNum = obitNum[0]['ОБИТНомер'].split('OBIT-')[1]
    }
    let result = {
        ports,
        obitNum:obitNum ? obitNum : req.query.obit,
        ip
    }
    console.log(result)
    res.send(result)
})
app.get('/all-telecom-boxes',async (req,res)=>{
    let promise = await instance.post('netobject/getbyphisadruid',{
        'pauids':req.query.uid
    })
    let allInfo = promise.data.Answer
    res.send(allInfo)

})
app.get('/test',async (req,res)=>{
    let promise = await getSwitchDescriptionByObit(req.query.obit)
res.send(promise)
})
app.get('/test2',async (req,res)=>{
    let promise = await getSwitchByIp(req.query.ip)
res.send(promise)
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

export default authorizeRequest