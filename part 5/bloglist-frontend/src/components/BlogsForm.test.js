import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogsForm'

describe('Details of Blog Form', () => {
        const addBlog  = jest.fn()

        const component = render(
            <BlogForm addBlog={addBlog} />
        )

    test('Check author of form', () => {
        const titleInput = component.container.querySelector('#title')
        const authorInput = component.container.querySelector('#author')
        const url = component.container.querySelector('#url')
        const form = component.container.querySelector('form')

        fireEvent.change(titleInput, {
            target: { value: 'title input' }
        })
        fireEvent.change(authorInput, {
            target: { value: 'author input' }
        })
        fireEvent.change(url, {
            target: { value: 'url input' }
        })
        fireEvent.submit(form)

        expect(addBlog.mock.calls).toHaveLength(1)
        expect(addBlog.mock.calls[0][0].title).toBe('title input')
        expect(addBlog.mock.calls[0][0].author).toBe('author input')
        expect(addBlog.mock.calls[0][0].url).toBe('url input')
    })
})