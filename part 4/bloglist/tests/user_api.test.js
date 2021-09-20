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
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
    
        await user.save()
      })
    test('new note will be created if user is logged in', async () => {
      const blogsStart = await helper.blogsInDb()

      const userBlog = {
        username: 'root',
        password: 'sekret',
        
          title: "CodeWhiz",
          author: "Coder",
          url: "thecode.com",
          likes: 34, 
      
      }

      const result = await api
        .post('/api/login')
        .send(userBlog)
        .expect(200)
      const token = result.body.token

      await api
      .post('/api/blogs')
      .set('authorization',`bearer ${token.toString()}`)
      .send(userBlog)
      .expect(200)

     const blogsEnd = await helper.blogsInDb() 
      expect(blogsEnd).toHaveLength(blogsStart.length +1)
    })

  })

  describe('Deleting blogs', () => {

    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()

    })

    test('Blog will only be deleted if correct user is logged in and user id match', async () => {
      const blogsStart = await helper.blogsInDb()

    const userBlog = {
      username: 'root',
      password: 'sekret',
      
        title: "CodeWhiz",
        author: "Coder",
        url: "thecode.com",
        likes: 34, 
    
    }

    const result = await api
      .post('/api/login')
      .send(userBlog)
      .expect(200)

      const token = result.body.token

      const resp = await api
        .post('/api/blogs')
        .set('authorization',`bearer ${token.toString()}`)
        .send(userBlog)
        .expect(200)
      console.log(resp.body)
      const newBlogId = resp.body.id
      const blogsAfterAdd = await helper.blogsInDb()

      expect(blogsAfterAdd).toHaveLength(blogsStart.length +1)
      console.log('newBlogId', newBlogId)

      await api
        .delete(`/api/blogs/${newBlogId}`)
        .set('authorization',`bearer ${token.toString()}`)
        .expect(204)
        //${resp.body.id.toString()}

      const blogsAfterDelete = await helper.blogsInDb()
      expect(blogsAfterDelete).toHaveLength(blogsAfterAdd.length -1)

      const blogsList = blogsAfterAdd.find(b => b.id === newBlogId)
      expect(blogsAfterDelete).not.toContain(blogsList)
    })

    test('Blog will not be deleted if incorrect tries deleting it', async () => {
      const blogs = await helper.blogsInDb()

    const userBlog = {
      username: 'root',
      password: 'sekret',
      
        title: "CodeWhiz",
        author: "Coder",
        url: "thecode.com",
        likes: 34, 
    
    }


    const result = await api
      .post('/api/login')
      .send(userBlog)
      .expect(200)


      const token = result.body.token

      const resp = await api
      .post('/api/blogs')
      .set('authorization',`bearer ${token.toString()}`)
      .send(userBlog)
      .expect(200)
      console.log(resp.body)

      const blogsListMid = await helper.blogsInDb()
      expect(blogsListMid).toHaveLength(blogs.length +1)

      const passwordHash = await bcrypt.hash('secret', 10)
      const user2 = new User({ username: 'root2', passwordHash })
  
      await user2.save()

      const user2Log = {
        username: 'root2', password: 'secret'
      }

     const userTwoResp = await api
      .post('/api/login')
      .send(user2Log)
      .expect(200)

      const userTwoToken = userTwoResp.body.token

      const reply = await api
        .delete(`/api/blogs/${resp.body.id}`)
        .set('authorization',`bearer ${userTwoToken.toString()}`)
        .expect(401)
        console.log(reply.body)
        //${resp.body.id.toString()}
      
        const blogListFinal = await helper.blogsInDb()
        expect(blogsListMid).toHaveLength(blogListFinal.length)
    })

  })

 /* describe('add many blogs to same user', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      await Blog.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })

     test('user should hold many blogs', async () => {

      const blogsStart  = await helper.blogsInDb()

      const userBlog = {
        username: 'root',
        password: 'sekret',
        
          title: "BLOG 1",
          author: "Coder",
          url: "thecode.com",
          likes: 34, 
      
      }

      const result = await api
        .post('/api/login')
        .send(userBlog)
        .expect(200)
        
      const token = result.body.token

        await api
        .post('/api/blogs')
        .set('authorization',`bearer ${token.toString()}`)
        .send(userBlog)
        .expect(200)

        const numBlogsOneAdd = helper.blogsInDb()
        console.log('numBlogsOneAdd', numBlogsOneAdd)
        expect(blogsStart).toHaveLength(numBlogsOneAdd.length + 1)

        const userBlog2 = {
          username: 'root',
          password: 'sekret',
          
            title: "BLOG 2",
            author: "Coder2",
            url: "thecode2.com",
            likes: 37, 
        
        }

        // await api
        // .post('/api/blogs')
        // .set('authorization',`bearer ${token.toString()}`)
        // .send(userBlog2)
        // .expect(200)

      //   const numBlogsTwoAdd = helper.blogsInDb()
      //   expect(numBlogsTwoAdd).toHaveLength(blogsStart.length + 2)
    }) 
  }) */

  describe('User has more than one blog', () => {

    beforeEach(async () => {
      await User.deleteMany({})
      await Blog.deleteMany({})
     
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()

      const userBlog = {
        username: 'root',
        password: 'sekret',
        
          title: "BLOG 1",
          author: "Coder",
          url: "thecode.com",
          likes: 34, 
      
      }
      const userBlog2 = {
        username: 'root',
        password: 'sekret',
        
          title: "BLOG 2",
          author: "Coder2",
          url: "thecode2.com",
          likes: 37, 
      
      }
  
  
      const result = await api
        .post('/api/login')
        .send(userBlog)
        .expect(200)
  
  
        const token = result.body.token
  
        await api
        .post('/api/blogs')
        .set('authorization',`bearer ${token.toString()}`)
        .send(userBlog)
        .expect(200)

        await api
        .post('/api/blogs')
        .set('authorization',`bearer ${token.toString()}`)
        .send(userBlog2)
        .expect(200)
    })

    test('Delete blog from user who has multiple blogs', async () => {
          const usersStart = await helper.usersInDb() 
          const blogsStart = await helper.blogsInDb() 

          const userTest = {
            username: 'root',
            password: 'sekret',
          }

          //User must first log in to obtain token
          const result = await api
            .post('/api/login')
            .send(userTest)
            .expect(200)
  
          const token = result.body.token
          const userName = result.body.username
         // console.log('result.body', result.body)
          const thisUser = usersStart.find( u => u.username === userName)
          console.log('thisUser', thisUser)
          const newBlogId = thisUser.blogs[0].toString()
          console.log(newBlogId)
         // const blogsAfterAdd = await helper.blogsInDb()

         // expect(blogsAfterAdd).toHaveLength(blogsStart.length +1)

              await api
                .delete(`/api/blogs/${newBlogId}`)
                .set('authorization',`bearer ${token.toString()}`)
                .expect(204)
          const blogsFinal = await helper.blogsInDb()
          expect(blogsFinal).toHaveLength(blogsStart.length -1)
          const finalBlogsListIDs = blogsFinal.map(b => b.id)
          console.log('finalBlogsListIDs', finalBlogsListIDs)
          expect(blogsFinal).not.toContain(blogsStart.find(b => b.id === finalBlogsListIDs))
    })
  })

afterAll(() => {
    mongoose.connection.close() 
})