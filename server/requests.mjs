import dateFormat from "dateformat";
import fs from "fs";
import instance from "./middleware/axios.middlewarem.mjs";



const requests = {
    getJobList:async ()=>{
        let promise = await instance.post(`joblist/get`)
        return promise.data.Answer
    },
    getOrderIP: async (order) => {
        let promise = await instance.get(`tickets/getsettings?number=${order}`)
        return promise.data.Answer
    },
    getTickets: async (order) => {
         let promise = await instance.get(`Tickets/get?number=${order}`)
        return promise.data.Answer
    },
    getJobHistory : async(order) => {
        let promise = await instance.get(`/job/history?number=${order}`)
        return promise.data.Answer
    },



    getOrders: (date, cfg) => {
    return instance.get(`joblist/update?date=20211225205205` ,cfg)
},



    getJobListUpdate:({},cfg)=>{
        return instance.get(`joblist/update?date=20211228170844`,cfg)
    },

    getEquipmentByOrders: ({},cfg) => {
    return instance.get('trade/getEquipmentByOrders', cfg)
},




    getReport: async (start,finish,variant) => {
        let startDate = dateFormat(start, "yyyy-mm-dd") + "T00:00:00"
       let endDate = dateFormat(finish, "yyyy-mm-dd") + "T23:59:59"
    let promise = await instance.post('Reports/Get', {
        "id": "c2f0ef93-c513-11ea-b976-005056b57a2d",
        "param": {
            "Filter": [],
            "Params": [
                {
                    "id": "d98ea70f-c5d9-4c44-9808-7d98f9971031",
                    "use": true,
                    "value": {
                        "Variant": variant ? variant: "Этотмесяц",
                         "StartDate": startDate,
                         "EndDate": endDate
                    }
                }
            ]
        }
    })
        return promise.data.Answer
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



