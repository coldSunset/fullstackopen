import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState(null)
  const [author, setAuthor] = useState(null)
  const [url, setUrl] = useState(null)

  useEffect(() => {
    if(user)
    {

      //const header = {headers: {Authorization: `Bearer ${user.token.toString()}`}}
      //console.log('bearer', header)
    blogService.setToken(user.token)
    blogService.getAll()
      .then(blogs => {
        blogs = blogs.filter(b => b.user.username === user.username)
        setBlogs( blogs )
      }
      
    )}  
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const addBlog= (event) => {
    event.preventDefault()
    if(!(title.trim()=="")
    && !(author.trim()=="")
    && !(url.trim()=="")) {
      const blogObject = {
        title: title, 
        author: author,
        url: url, 
        user: user,
      }
      blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setErrorMessage(`a new blog ${title} by ${author} added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setTitle('')
        setAuthor('')
        setUrl('')
      })
    }
    else {
      alert("You must insert text")
    }
    
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
    <div>
      username
        <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
        <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
  </form>
  )

   const blogsForm = () => (
    <form onSubmit={addBlog}>
    <div>
      title:
        <input
        type="text"
        value={title}
        name="Title"
        onChange={({ target }) => setTitle(target.value)}
      />
    </div>
    <div>
      author:
        <input
        type="text"
        value={author}
        name="Author"
        onChange={({ target }) => setAuthor(target.value)}
      />
    </div>
    <div>
      url:
        <input
        type="text"
        value={url}
        name="Url"
        onChange={({ target }) => setUrl(target.value)}
      />
    </div>
    <button type="submit">create</button>
  </form>
  ) 

  return (
    <div>
      <h2>blogs</h2>
      <Notification message = {errorMessage}/> 
      {user === null ?
      <h2>Login</h2>:
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button>
      <h2>create new</h2>
      {blogsForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}</p>
      }
      {user === null && loginForm()}
      
      
    </div>
  )
}

export default App