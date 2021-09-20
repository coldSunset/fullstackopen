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
    //console.log('PRINT TOKEN:', request.token)
    //console.log('user', request.body.user)

    const blog = new Blog({
      title: request.body.title,
      url: request.body.url,
      likes: request.body.likes,
      author: request.body.author,
      user: request.body.user._id
    })

    console.log('blog', blog)
    const savedBlog = await blog.save()
    //logger.info(`added ${blog.title} to the blog list`)
    request.body.user.blogs = request.body.user.blogs.concat(savedBlog._id) 
    const user = request.body.user
    await user.save()
    //logger.info(`blog linked to user ${user.username}`)
    response.json(savedBlog.toJSON())

  })

blogsRouter.delete('/:id', async (request, response) => {

    const userBlogStr = request.body.user.blogs.toString()
    console.log('user blogs to string', userBlogStr)
    console.log('request.params.id', request.params.id)
    if( userBlogStr.includes( request.params.id) ) {
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