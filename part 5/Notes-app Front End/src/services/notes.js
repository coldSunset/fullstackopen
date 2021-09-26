import axios from 'axios'
//const baseUrl = 'http://localhost:3001/notes'
//const baseUrl = 'http://192.168.1.110:3001/notes/'
//const baseUrl = 'https://polar-anchorage-51347.herokuapp.com/api/notes'
const baseUrl = '/api/notes'

let token = null 

const setToken = newToken => {
    token = `bearer ${newToken}`
}
const getAll = () => {
    const request = axios.get(baseUrl)
    const nonExisting = {
        id: 10000, 
        content: 'This note is not saved to the server', 
        date: '2019-05-30T17:30:31.098Z', 
        important: true, 
    }
    return request.then(response=>response.data)
}

const create = async newObject => {
    const config = {
        headers: { Authorization: token }, 
    }

    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response=>response.data)
}

export default {getAll, create, update, setToken }