import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogsForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if(user)
    {
    blogService.setToken(user.token)
    blogService.getAll()
      .then(blogs => {
       // blogs = blogs.filter(b => b.user.username === user.username)
        blogs = blogs.sort((a,b)=>{return b.likes - a.likes})
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

  const addBlog= ({title, author, url}) => {
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
      })
    }
    else {
      alert("You must insert text")
    }
    
  }

  const putLike = async ({blogId,likes,author,title,url}) => {
    const newObject = {
      user:user.id,
      likes:likes, 
      author:author,
      title:title,
      url:url,
    } 
    blogService.setToken(user.token)
     const request = await blogService
                            .updateContent(
                              blogId,
                              newObject,
                            )
    console.log(request)
    let modBlog = blogs.filter(b => b.id !==request.id)
    modBlog = modBlog.concat(request)
    modBlog = modBlog.sort((a,b)=>{return b.likes - a.likes})
    console.log('rearranged blogs', modBlog)
    setBlogs(modBlog) 

  }

  const deleteBlog = async({blogId}) => {
    const thisBlog = blogs.find(b => b.id === blogId)
    if(window.confirm(`Remove blog ${thisBlog.title} by ${thisBlog.author}`)) 
    {blogService.setToken(user.token)
    const response = await blogService
                      .deleteItem(blogId)
    let modBlog = blogs.filter(b => b.id !==blogId)
    setBlogs(modBlog)}
  }

  const checkUserBlogs =  ({blogId}) => {
        console.log('blogId',blogId)
        let usersBlogs = blogs.filter(b=> b.user.username ===user.username)
        usersBlogs = usersBlogs.map(b=>b.id ===blogId)
        console.log('userBlogs',usersBlogs)
        const disp = usersBlogs.includes(true)? true : false
        return disp
  }

  const handleLogin = async ({username, password}) => {
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
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

  const loginForm = () => {

    return (
      <Togglable buttonLabel='Log in'>
      <LoginForm handleLogin={handleLogin}
      />
      </Togglable>
    )
}

   const blogsForm = () => (
     <Togglable buttonLabel='create new blog'>
     <BlogForm addBlog={addBlog}/>
    </Togglable>
  ) 

  return (
    <div>
      <h2>blogs</h2>
      <Notification message = {errorMessage}/> 
      {user === null ?
      <h2>Login</h2>:
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button>

      <p>{blogsForm()}</p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} 
        increaseLike={putLike}
        removeBlog={deleteBlog} 
        checkUserBlogs={checkUserBlogs}/>
      )}</p>
      }
      {user === null && loginForm()}
      
      
    </div>
  )
}

export default App