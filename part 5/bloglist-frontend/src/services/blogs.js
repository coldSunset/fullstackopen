import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }
  const request = await axios
    .get(baseUrl, config)
  const userblogs = request.data.filter(blog => 'user' in blog)
  console.log(userblogs)
  return userblogs
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const updateContent = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = await axios
              .put(`${baseUrl}/${id}`, newObject,config)
            return request.data
}

const deleteItem = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = await axios
              .delete(`${baseUrl}/${id}`,config)
        return request.data
}


export default { getAll, setToken, create, updateContent, deleteItem }