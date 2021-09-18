import React from 'react'

const Notification = ({ message}) => {
    if(message == null){
        return null
    }

    if(message.includes('ERROR')  ||
    message.includes('validation')||
    message.includes('failed')){
    return (
      <div className="error">
        {message}
      </div>
    )
    }
    else {
        return(
        <div className="update">
        {message}
      </div>
    )
    }
  }


  export default Notification