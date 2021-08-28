import React from 'react'

const Notification = ({message}) => {
    console.log("Reached notification!")
    if(message === null){
        return null
    }

    return (
        <div className="error">
            {message}
        </div>
    )
}

export default Notification
