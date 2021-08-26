import React from 'react'

const Filter = (props) => {
    const {newFilter,handleFilterChange}=props
    return(
      <p>
      filter shown with<input value={newFilter} onChange={handleFilterChange}/>
    </p>
    )
  }

  export default Filter