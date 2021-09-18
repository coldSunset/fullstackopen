const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

const Blog = require('../models/blog')

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('`username` to be unique')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })
  })

  describe('Return Error if Username and/or password is less than 3 characters', () => {
      test('username is less than 3 characters long', async () => {
          const usersAtStart = await helper.usersInDb()

          const newUser = {
              username: 'do', 
              name: 'rejectme',
              password: 'passlength',
          }

          const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('is shorter than the minimum allowed length')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

      })

      test('Password is less than 3 characters long', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'Pass6', 
            name: 'rejectme',
            password: 'f',
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
        console.log('result.body',result.body)
      expect(result.body.error).toContain('Password is less than 3 characters')
      })
  })

  describe('get user info', () => {
      test('recieve a user', async () => {
        const usersAtStart = await helper.usersInDb()
        console.log(usersAtStart)

        await api
          .get('/api/users')
          .expect(200)
          .expect('Content-Type', /application\/json/)
          

      })
  })

  describe('Login Interface', () => {
      test('Delete user from database', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'lognest',
            name: 'lgin',
            password: 'test',
          }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
      
      const usersAtStartNew = await helper.usersInDb()
      newestBlog = usersAtEnd.find(b => b.username === newUser.username)
      
      const id = newestBlog.id

      await api
          .delete(`/api/users/${id}`)
          .expect(204)
        
          const userListEndNew = await helper.usersInDb()
          expect(userListEndNew).toHaveLength(usersAtStartNew.length -1)
  
          const contents = usersAtEnd.find(b => b.id === id)
          
          expect(contents).not.toContain(userListEndNew)
        // const result = await api
        //     .post('/api/login')
        //     .send(loginInfo)
        //     //.expect(200)
        //     //.expect('Content-Type', /application\/json/)
        //     console.log(result)
        // expect(result.body).toContain()
      })

      test('User supplies corrrect password', async () => {
        const newUser = {
          username: 'LogUser',
          name: 'Login',
          password: 'logs',
        }
        await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        newestBlog = usersAtEnd.find(b => b.username === newUser.username)
        const id = newestBlog.id

        const userLogin = {
          username: newUser.username,
          password: newUser.password,
        }

        const result = await api
          .post('/api/login')
          .send(userLogin)
          .expect(200)
        console.log(result.body)

        await api
            .delete(`/api/users/${id}`)
            .expect(204)
      })

      test('User supplies incorrrect password', async () => {
        const newUser = {
          username: 'LogUser',
          name: 'Login',
          password: 'logs',
        }
        
        await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        newestBlog = usersAtEnd.find(b => b.username === newUser.username)
        const id = newestBlog.id

        const userLogin = {
          username: newUser.username,
          password: 'wrong',
        }

        const result = await api
          .post('/api/login')
          .send(userLogin)
          .expect(401)
        console.log(result.body)

        await api
            .delete(`/api/users/${id}`)
            .expect(204)
      })
  })

  describe('creating notes for logged in only users', () => {
      beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
    
        await user.save()
      })
    test('new note will be created if user is logged in', async () => {
      const users = await helper.usersInDb()
      console.log(users)

      const userBlog = {
        username: 'root',
        password: 'sekret',
        
          title: "CodeWhiz",
          author: "Coder",
          url: "thecode.com",
          likes: 34, 
      
      }

      const result  = await api
        .post('/api/login')
        .send(userBlog)
        .expect(200)
      const token = result.body.token
      console.log('token', token)
      const result2 = await api
      .post('/api/blogs')
      .send(userBlog)
      .expect(200)
    console.log('result.body',result2.body)

    })
  })

afterAll(() => {
    mongoose.connection.close() 
})