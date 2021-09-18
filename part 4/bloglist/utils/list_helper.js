const _ = require('lodash')
const blog = require('../models/blog')

const dummy  = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum , item) => {
        //console.log(`sum ${sum} item ${item} total ${sum+item}`)
        return sum + item
    }

    const likesArray = blogs.map(b => b.likes)
   // console.log(likesArray)
    return likesArray.reduce(reducer,0)
}

const favoriteBlog = (blogs) => {
    const likesArray = blogs.map(b => b.likes)
    const mostLikes = Math.max(...likesArray)
    const mostlikedBlog = blogs.find(b => b.likes === mostLikes)
    return {
        title: mostlikedBlog.title,
        author: mostlikedBlog.author,
        likes: mostlikedBlog.likes
    }
}

const mostBlogs = (blogs) => {
    //arrayBlogs = blogs.map(b => b.author)
    if(blogs.length ===0)
    {
        return {}
    }
    const countAuthor = _.countBy(blogs,  'author' )
    
    const reducer = (accumulator, item) => {
        return (
            blogs.accumulator > blogs.item
                ? accumulator
                : item
            )}
    
    const authorMostBlogs = _.keys(countAuthor).reduce(reducer)

    return (
        {
            author: authorMostBlogs,
            blogs: countAuthor[authorMostBlogs]
        }
    )
}

const mostLikes = (blogs) => {

    if(blogs.length ===0){
        return {}
    }

   authorKeys = blogs.map(b => b.author)
   likesKeys = blogs.map(b => b.likes)
   
   authorArr = _.zip(authorKeys, likesKeys)
   console.log(authorKeys)

    blogObj = {}
    blogObj[authorArr[0][0]] = authorArr[0][1]
   
   // accumulator and item have been swapped ...
   const reducer1 = (item, accumulator) => {
       console.log('accumulator', accumulator, 'item', item)
       if(accumulator[0] in blogObj){
        blogObj[accumulator[0]] = blogObj[accumulator[0]] + accumulator[1]
       }
       else{
           blogObj[accumulator[0]] = accumulator[1]
       }
       
       console.log(blogObj)
       return accumulator
   }
   
   const obj = authorArr.reduce(reducer1)

   const reducer = (accumulator, item) => {
    return (
        blogObj[accumulator] > blogObj[item]
            ? accumulator
            : item
        )}
        const authorMostLikes = _.keys(blogObj).reduce(reducer)
        console.log(authorMostLikes)

    
    return {
        author: authorMostLikes,
        likes: blogObj[authorMostLikes]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}