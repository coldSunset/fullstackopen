const User = require('../models/user')

const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs.map(blog => blog.toJSON()))  
  })


  
blogsRouter.post('/', async (request, response) => {
    let body = request.body
    //const token = getTokenFrom(request)
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid'})
    }

    const user = await User.findById(decodedToken.id)

    //console.log(user)
    body = {...body, user: body.userId}
   // console.log(blog)

    const blog = new Blog({
      title: body.title,
      url: body.url,
      likes: body.likes,
      author: body.author,
      user: user._id
    })

    const savedBlog = await blog.save()
    console.log('savedBlog._id', savedBlog._id)
    response.json(savedBlog.toJSON())
    user.blogs = user.blogs.concat(savedBlog._id) 
    await user.save()
    console.log('this user should have two blog ids',user)
    response.json(savedBlog.toJSON())

  })

blogsRouter.delete('/:id', async (request, response) => {
  const body = request.body
  
  const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid'})
    }

    const user = await User.findById(decodedToken.id)
    console.log('user blogs:', user.blogs)
    const userBlogStr = user.blogs.toString()
    console.log('user blogs to string', userBlogStr)
    console.log('request.params.id', request.params.id)
    if( userBlogStr === request.params.id ) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }
     else {
       return response.status(401).json({ error: "invalid user token" })
     }
    
})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }

  Blog.findByIdAndUpdate(request.params.id, blog, {new:true})
    .then(updatedBlog => {
      response.json(updatedBlog.toJSON())
    })
    .catch(error => next(error))
})

module.exports = blogsRouter