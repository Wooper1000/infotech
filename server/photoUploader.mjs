import fs from "fs";
import axios from "axios";
import base64 from "./base64.mjs";
import {log} from "console";

class PhotoUploader {
    postPhotoOnInfotechServer(photo, uid) {        //return promise
        let data = fs.createReadStream(photo.path)
        return new Promise((resolve, reject) => {

               axios.post('https://ext.obit.ru/crm/hs/extaccess/files/uploadbin', data, {
                   headers: {
                       'Content-Disposition': `filename=${base64(photo.originalname)}`,                                //имя файла в base64
                       'CRM-uidOwner': uid,                  //uid заявки
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
                   .then(result => {
                       console.log(result.data.ReturnText)
                       if (!result.data.ReturnCode) resolve(result.data.ReturnText)
                       else reject('error while loading photo')
                   }).catch(err=>console.log(err) )
        })
    }
uploadPhotos(photos,uid){
        let promises = []
        photos.forEach(photo=>{
            promises.push(this.postPhotoOnInfotechServer(photo,uid))
        })
    return Promise.all(promises)
}
}
export default new PhotoUploader()