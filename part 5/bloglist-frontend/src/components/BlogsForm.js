import React, {useState} from 'react'

const BlogForm = ({addBlog}) => {
    
  const [title, setTitle] = useState(null)
  const [author, setAuthor] = useState(null)
  const [url, setUrl] = useState(null)

  const sendBlog = (event) => {
    event.preventDefault()

    addBlog({
        title:title,
        author:author,
        url:url,
    })
    
    setTitle('')
    setAuthor('')
    setUrl('')
  }

    return (
        <form className='formDiv' onSubmit={sendBlog}>
    <div>
      title:
        <input
        id='title'
        type="text"
        value={title}
        name="Title"
        onChange={({target}) => setTitle(target.value)}
      />
    </div>
    <div>
      author:
        <input
        id='author'
        type="text"
        value={author}
        name="Author"
        onChange={({target}) => setAuthor(target.value)}
      />
    </div>
    <div>
      url:
        <input
        id='url'
        type="text"
        value={url}
        name="Url"
        onChange={({target}) => setUrl(target.value)}
      />
    </div>
    <button type="submit">create</button>
  </form>
    )
}

export default BlogForm