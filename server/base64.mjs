
const base64 = (text) => {
    return new Buffer(text).toString('base64')
}
export default base64