import React from 'react';
import './SearchBar.css';

const SearchBar=({searchTerm,setSearchTerm})=>{
  return(
    <div className="search-container">
      <input type="text" className="search-input" placeholder="Search GitHub Users..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
    </div>
  );
};

export default SearchBar;
