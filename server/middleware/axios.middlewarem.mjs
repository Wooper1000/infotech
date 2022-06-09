import axios from "axios";
import fs from 'fs'
let ibSessionPath = '../config/ibSession'
let ibSession =fs.readFileSync(ibSessionPath,"utf-8" )
let isIbSessionValid = false
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
        ...(isIbSessionValid && {Cookie:ibSession})
    }
})


instance.interceptors.request.use(async config => {
        return config;
    },
    error => {
        return Promise.reject(error)
    })

instance.interceptors.response.use((response) => {
    console.log('Получилось с существующей сессией')
    return response
}, async function (error) {
    const originalRequest = error.config;
    axios.defaults.headers.common['Authorization'] = 'Basic 0KjQsNCx0LDQvdGB0LrQuNC50JTQkjphV0hSQ09scjh6'
    axios.defaults.headers.common['IBSession'] = 'start'
    console.log('Обрабатываем ошибку')
    const result = await axios(originalRequest)
    let cookie = result.headers['set-cookie'][0].split(';')[0]
    fs.writeFileSync(ibSessionPath,cookie)
    return result
})
export default instance