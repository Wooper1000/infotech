import dateFormat from "dateformat";
import axios from "axios";
import FormData from 'form-data'
import authorizeRequest from "./server.mjs";
import fs from "fs";

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
    }
})

const requests = {
    getOrders: (date, cfg) => {
    return instance.get(`joblist/update?date=20211225205205` ,cfg)
},

    getOrderIP: (order, cfg) => {
    return instance.get(`tickets/getsettings?number=${order}`, cfg)
},
    getJobList:(data={},cfg)=>{
        return instance.post(`joblist/get`,JSON.stringify(data),cfg)
    },
    getJobListUpdate:({},cfg)=>{
        return instance.get(`joblist/update?date=20211228170844`,cfg)
    },

    getEquipmentByOrders: ({},cfg) => {
    return instance.get('trade/getEquipmentByOrders', cfg)
},

    getJobHistory: (order, cfg) => {
    return instance.get(`/job/history?number=${order}`, cfg)
},

    getTickets: (order, cfg) => {
    return instance.get(`Tickets/get?number=${order}`, cfg)
},
    getReport: (date={}, cfg) => {
        let startDate = dateFormat(date.start, "yyyy-mm-dd") + "T00:00:00"
       let endDate = dateFormat(date.finish, "yyyy-mm-dd") + "T23:59:59"
    return instance.post('Reports/Get', {
        "id": "c2f0ef93-c513-11ea-b976-005056b57a2d",
        "param": {
            "Filter": [],
            "Params": [
                {
                    "id": "d98ea70f-c5d9-4c44-9808-7d98f9971031",
                    "use": true,
                    "value": {
                        "Variant": date.variant ? date.variant: "Этотмесяц",
                         "StartDate": startDate,
                         "EndDate": endDate
                    }
                }
            ]
        }
    }, cfg)
},
    call: (key, cfg) => {
    console.log(key)
    return instance.get(`/call/ticket?Key=${key}`, cfg)
},
    closeOrder:(options,cfg)=>{
        return instance.post('/orderreport/register',options,cfg)
    },
    postPhoto:(options,cfg)=>{
        let form = fs.createReadStream('./pic3.jpg')
        let fileName = "Zl85Mzc4Mzk4Nzg3MjA3OC5qcGcNCg=="
        return instance.post('/files/uploadbin',form,{
            headers:{
                'Content-Disposition':'filename='+fileName,
                'CRM-FileName': Buffer.from(options.fileName).toString('base64'),
                'CRM-filetype' : options['crm-filetype'],
                'CRM-typeOwner':options['crm-typeowner'],
                'CRM-uidOwner':options.uid,
                'IBSession': 'start',
                'Authorization' :'Basic 0KjQsNCx0LDQvdGB0LrQuNC50JTQkjphV0hSQ09scjh6'
            }
        })
    }

}
export default requests



