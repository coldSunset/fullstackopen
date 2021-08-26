import React from 'react'
import Contacts from './Contacts'

const Person = ({persons,search,filterArray, deleteHandler}) => {
    if(search){
    persons = persons.filter(per=>filterArray.includes(per.name))
    }
    return (
      persons.map(person=><Contacts key={person.name}
                                    person={person}
                                    deleteHandler={deleteHandler}/>)
    )
  }

  export default Person