import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('Rendering Blogs', () => {
    const blog = {
        title: 'test blog',
        author: 'test author',
        likes: 5,
        url: 'doesnotexist.com',
    }

    let mockcheckUserBlogs = jest.fn()
    let mockincreaseLike = jest.fn()

    test('Blog renders author and title', () => {

        const component = render(
            <Blog blog={blog} checkUserBlogs={mockcheckUserBlogs}/> 
        )

        component.debug()

        expect(component.container).toHaveTextContent(
            'test blog'
        )

        expect(component.container).toHaveTextContent(
            'test author'
        )
    })

    test('After hitting view button, likes and url appear', () => {
        
        const component = render(
            <Blog blog={blog} checkUserBlogs={mockcheckUserBlogs}/> 
        )

        const button = component.getByText('view')
        fireEvent.click(button)

        expect(component.container).toHaveTextContent(
            '5'
        )

        expect(component.container).toHaveTextContent(
            'doesnotexist.com'
        )
    })

    test('like button is liked twice', () => {
        const component = render(
            <Blog blog={blog} 
            checkUserBlogs={mockcheckUserBlogs}
            increaseLike={mockincreaseLike}/> 
        )

        const button = component.getByText('view')
        fireEvent.click(button)

        const likeButton = component.getByText('like')
        fireEvent.click(likeButton)
        fireEvent.click(likeButton)

        expect(mockincreaseLike.mock.calls).toHaveLength(2)


    })
})