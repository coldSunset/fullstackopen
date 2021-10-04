import React, {useState} from 'react'

const Blog = ({blog, increaseLike, removeBlog, checkUserBlogs}) => {

  const [defaultView, setDefaultView] = useState(true)

  const defaultDisp = { display: defaultView ? '' : 'none'}
  const expandedDisp = { display: defaultView? 'none' : ''}
  
  const blogOwner = { display: checkUserBlogs({ blogId:blog.id }) ? '': 'none' }
  const hitLike = () => {
      increaseLike({
        blogId: blog.id,
        likes:blog.likes+1,
        author:blog.author,
        title:blog.title,
        url:blog.url
      })
  }

  const deleteBlog = () => {
    removeBlog({
      blogId: blog.id
    })
  }
  
  const blogStyle = { 
    paddingTop: 10, 
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <div>
  <div className='blog' style={blogStyle}>
    {blog.title} {blog.author} 
    <button style ={defaultDisp} onClick= {() => setDefaultView(false)}> view </button>
    <button style={expandedDisp} onClick= {() => setDefaultView(true)}> hide </button>
    <div style = {expandedDisp}>
    <p>{blog.url}</p>
    <p>{blog.likes} <button onClick={hitLike}>like</button></p>
    <p>{blog.author}</p>
      <button style={blogOwner} onClick={deleteBlog}>remove</button> 
  </div>
  </div>  
  
  
  </div>

  )
}

export default Blog