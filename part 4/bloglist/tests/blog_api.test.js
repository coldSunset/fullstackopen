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
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('a specfic blog is within the returned bloglist', async() => {
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.title)
        expect(contents).toContain(
            'React patterns'
        )
    })
    
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
})

describe('Adding data', () => {
    test('a blog can be added', async() => {
        const newBlog = {
            title: "CodeWhiz",
            author: "Coder",
            url: "thecode.com",
            likes: 34, 
        }
    
        await api
            .post('/api/blogs')
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
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })
})

describe('Validating data', () => {
    test('If the likes property is missing, it will default to 0', async () => {
        const newBlog = {
            _id: "5a422ba71b54a676234d17fb",
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            __v: 0
          }
        
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(200)
          .expect('Content-Type', /application\/json/)
    
          const blogsAtEnd = await helper.blogsInDb()
          const contents = blogsAtEnd.find(b => b.title === 'TDD harms architecture')
          expect(contents.likes).toBe(0)
    })
    
    test('If new blog does not contain the title and url fields, the request will be returned with a 400 Bad Request', async () => {
        const newBlog = {
            _id: "5a422ba71b54a676234d17fb",
            author: "Robert C. Martin",
            __v: 0
          }
    
          await api
            .post('/api/blogs')
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
        const blogListStart = await helper.blogsInDb()
        //console.log(blogListStart)
        del_id = blogListStart[0].id
        await api
            .delete(`/api/blogs/${del_id}`)
            .expect(204)
        
        const blogListEnd = await helper.blogsInDb()
        expect(blogListEnd).toHaveLength(blogListStart.length -1)

        const contents = blogListStart.find(b => b.id === del_id)
        //console.log(contents)
        expect(contents).not.toContain(blogListStart[0])
    })
})

describe('modify a blog', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('change likes on a blog', async () => {
        const blogListStart = await helper.blogsInDb()
        const modifyBlog = blogListStart[0] 
        //console.log(modifyBlog)
        modifyBlog.likes = 55
        await api
            .put(`/api/blogs/${modifyBlog.id}`)
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