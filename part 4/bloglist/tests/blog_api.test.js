const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

const Blog = require('../models/blog')

describe('when there is initially some blogs are saved', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
        await User.deleteMany({})
  
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
    
        await user.save()
    })

    test('blogs are returned as json', async () => {
    const result = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret',
      })

    const token = result.body.token
    
    await api
        .get('/api/blogs')
        .set('authorization',`bearer ${token.toString()}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('a specfic blog is within the returned bloglist', async() => {
        const result = await api
        .post('/api/login')
        .send({
        username: 'root',
        password: 'sekret',
      })

    const token = result.body.token
        const response = await api
            .get('/api/blogs')
            .set('authorization',`bearer ${token.toString()}`)
        const contents = response.body.map(r => r.title)
        expect(contents).toContain(
            'React patterns'
        )
    })
    
    test('all blogs are returned', async () => {
        const result = await api
        .post('/api/login')
        .send({
        username: 'root',
        password: 'sekret',
      })

        const token = result.body.token
        const response = await api
            .get('/api/blogs')
            .set('authorization',`bearer ${token.toString()}`)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
})

describe('Adding data', () => {
    test('a blog can be added', async() => {
        const result = await api
        .post('/api/login')
        .send({
        username: 'root',
        password: 'sekret',
      })

        const token = result.body.token

        const newBlog = {
            title: "CodeWhiz",
            author: "Coder",
            url: "thecode.com",
            likes: 34, 
        }
    
        await api
            .post('/api/blogs')
            .set('authorization',`bearer ${token.toString()}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
            const contents = blogsAtEnd.map(b => b.title)
            expect(contents).toContain(
                'CodeWhiz'
            )
    })
})

describe('Checking attribute fields', () => {
    test('identification field id', async() => {
        const result = await api
        .post('/api/login')
        .send({
        username: 'root',
        password: 'sekret',
      })

        const token = result.body.token
        const response = await api
            .get('/api/blogs')
            .set('authorization',`bearer ${token.toString()}`)
        expect(response.body[0].id).toBeDefined()
    })
})

describe('Validating data', () => {
    test('If the likes property is missing, it will default to 0', async () => {
        const result = await api
            .post('/api/login')
            .send({
            username: 'root',
            password: 'sekret',
          })
    
        const token = result.body.token

        const newBlog = {
            _id: "5a422ba71b54a676234d17fb",
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            __v: 0
          }
        
        await api
          .post('/api/blogs')
          .set('authorization',`bearer ${token.toString()}`)
          .send(newBlog)
          .expect(200)
          .expect('Content-Type', /application\/json/)
    
          const blogsAtEnd = await helper.blogsInDb()
          const contents = blogsAtEnd.find(b => b.title === 'TDD harms architecture')
          expect(contents.likes).toBe(0)
    })
    
    test('If new blog does not contain the title and url fields, the request will be returned with a 400 Bad Request', async () => {
        const result = await api
            .post('/api/login')
            .send({
            username: 'root',
            password: 'sekret',
          })
    
        const token = result.body.token

        const newBlog = {
            _id: "5a422ba71b54a676234d17fb",
            author: "Robert C. Martin",
            __v: 0
          }
    
          await api
            .post('/api/blogs')
            .set('authorization',`bearer ${token.toString()}`)
            .send(newBlog)
            .expect(400)
    })
})

describe('Deleting Data', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('Deleting a item should reduce the number of blogs', async () => {
        
        const userInfo = {
            username: 'root',
            password: 'sekret',
            title: 'Blog to be deleted',
            author: 'Moi',
            url: 'http://www.blog.delete.edu/',
            likes: 12
        }
        const result = await api
            .post('/api/login')
            .send(userInfo)
    
        const token = result.body.token

        const blogListStart = await helper.blogsInDb()
        //console.log(blogListStart)
        await api
            .post('/api/blogs')
            .set('authorization',`bearer ${token.toString()}`)
            .send(userInfo)
            .expect(200)

        const updatedBlogList = await helper.blogsInDb()
        const deleteBlog = updatedBlogList.find(b => b.title === userInfo.title) 
        console.log('deleteBlog', deleteBlog)
        del_id = deleteBlog.id
        await api
            .delete(`/api/blogs/${del_id}`)
            .set('authorization',`bearer ${token.toString()}`)
            .expect(204)
        
        const blogListEnd = await helper.blogsInDb()
        expect(blogListEnd).toHaveLength(updatedBlogList.length -1)

        const contents = updatedBlogList.find(b => b.id === del_id)
        //console.log(contents)
        expect(contents).not.toContain(deleteBlog)
    })
})

describe('modify a blog', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('change likes on a blog', async () => {
        const result = await api
            .post('/api/login')
            .send({
            username: 'root',
            password: 'sekret',
          })
    
        const token = result.body.token

        const blogListStart = await helper.blogsInDb()
        const modifyBlog = blogListStart[0] 
        //console.log(modifyBlog)
        modifyBlog.likes = 55
        await api
            .put(`/api/blogs/${modifyBlog.id}`)
            .set('authorization',`bearer ${token.toString()}`)
            .send(modifyBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb() 
        const modifiedBody = blogsAtEnd.find(b => b.id === modifyBlog.id)
        expect(modifiedBody.likes).toBe(55)
    })
})

afterAll(() => {
    mongoose.connection.close() 
})