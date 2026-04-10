import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import UserList from './components/UserList/UserList';
import RepoList from './components/RepoList/RepoList';
import useDebounce from './hooks/useDebounce';

function App(){
  const [searchTerm,setSearchTerm] = useState('');
  const [users,setUsers] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const [selectedUser,setSelectedUser] = useState(null);
  const [theme,setTheme] = useState('light');
  
  const [page,setPage] = useState(1);
  const [totalResultCount,setTotalResultCount] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(()=>{
    const searchUsers =async()=>{
      if(!debouncedSearchTerm){
        setUsers([]);
        setTotalResultCount(0);
        return;
      }

      setLoading(true);
      setError(null);
      try{
        const response=await fetch(`https://api.github.com/search/users?q=${debouncedSearchTerm}&page=${page}&per_page=10`);
        if(!response.ok) throw new Error('Query limit reached maybe?');
        const data = await response.json();
        setUsers(data.items);
        setTotalResultCount(data.total_count);
      }catch{
        setError('Something went wrong. Please try again later.');
      }finally{
        setLoading(false);
      }
    };

    searchUsers();
  }, [debouncedSearchTerm, page]);

  const toggleTheme=()=>{
    const newTheme =theme==='light'?'dark':'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme',newTheme);
  };

  const handleUserClick=(username)=>{
    setSelectedUser(username);
  };

  const handleBack=()=>{
    setSelectedUser(null);
  };

  return(
    <div className="app">
      <header className="header">
        <h1>GitHub Explorer</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme==='light'?'Dark Mode':'Light Mode'}
        </button>
      </header>

      <main>
        {selectedUser?(<RepoList username={selectedUser} onBack={handleBack} />):(
          <>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            {debouncedSearchTerm &&(
              <div className="pagination">
                <button className="page-btn" disabled={page===1} onClick={()=> setPage(p=>p-1)}>
                  Previous
                </button>
                <span>Page {page}</span>
                <button className="page-btn" disabled={users.length<10} onClick={()=> setPage(p=>p+1)}>
                  Next
                </button>
              </div>
            )}

            <UserList users={users} onUserClick={handleUserClick} loading={loading} error={error} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;