import React from 'react'

const Notification = ({message}) => {
    //console.log("Reached notification!")
    if(message === null){
        return null
    }

    if( message.includes('a new blog')) {
        return(<div className="success">
            {message}
        </div>)
    }

    return (
        <div className="error">
            {message}
        </div>
    )
}

export default Notification