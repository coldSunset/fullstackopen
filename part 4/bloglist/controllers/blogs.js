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
    let blog = request.body
    //const token = getTokenFrom(request)
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid'})
    }

    const user = await User.findById(decodedToken.id)

    console.log(user)
    blog = {...blog, user: blog.userId}
    console.log(blog)

    const bog = new Blog({
      title: blog.title,
      url: blog.url,
      likes: blog.likes,
      author: blog.author,
      user: user.id
    })

    const savedBlog = await bog.save()

    response.json(savedBlog.toJSON())
    user.blogs = user.blogs.concat(savedBlog._id) 
    await user.save()
    response.json(savedBlog.toJSON())

  })

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
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