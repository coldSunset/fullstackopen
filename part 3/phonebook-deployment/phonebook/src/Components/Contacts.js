import React from 'react'

const Contacts = ({person, deleteHandler}) => {

    return(
      <div>{person.name} {person.number}
      <button id = {person.id} onClick={deleteHandler}>delete</button>
      </div>
    )
  }


export default Contacts 