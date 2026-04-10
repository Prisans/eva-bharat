import React, {useState,useEffect} from 'react';
import './RepoList.css';

const RepoList = ({username,onBack}) => {
  const [repos,setRepos] = useState([]);
  const [filteredRepos,setFilteredRepos] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const [sortBy,setSortBy] = useState('stars');
  const [filterLang,setFilterLang] = useState('All');
  const [bookmarks,setBookmarks] = useState(()=>{
    const saved = localStorage.getItem('bookmarks');
    return saved ?JSON.parse(saved) : [];
  });

  useEffect(()=>{
    const fetchRepos = async()=>{
      setLoading(true);
      setError(null);
      try{
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!response.ok) throw new Error('Failed to fetch repo...');
        const data = await response.json();
        setRepos(data);
        setFilteredRepos(data);
      }catch{
        setError('Error fetching repo...');
      }finally{
        setLoading(false);
      }
    };

    if(username) fetchRepos();
  }, [username]);

  useEffect(()=>{
    if(repos.length>0){
        applyFiltersAndSort();
    }
  },[repos,sortBy,filterLang]);

  const applyFiltersAndSort =()=>{
    let result = [...repos];

    if(filterLang !=='All'){
      result = result.filter(repo=>repo.language ===filterLang);
    }

    if(sortBy=== 'stars'){
      result.sort((a,b)=>b.stargazers_count-a.stargazers_count);
    } else if(sortBy=== 'forks'){
      result.sort((a,b)=>b.forks_count-a.forks_count);
    }

    setFilteredRepos(result);
  };

  const toggleBookmark =(repo)=>{
    let newBookmarks;
    if (bookmarks.find(b=>b.id === repo.id)){
      newBookmarks = bookmarks.filter(b=>b.id !== repo.id);
    }else{
      newBookmarks = [...bookmarks, repo];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  const uniqueLanguages = ['All', ...new Set(repos.map(r=>r.language).filter(l=>l))];

  if(loading)return <div className="status">Loading repos...</div>;
  if(error)return <div className="status error">{error}</div>;

  return (
    <div className="repo-list-container">
      <button className="back-btn" onClick={onBack}>Back to Search</button>
      <h2>Repositories for {username}</h2>

      <div className="repo-controls">
        <label>Sort by: </label>
        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="stars">Stars</option>
          <option value="forks">Forks</option>
        </select>

        <label>Filter by Language: </label>
        <select className="filter-select" value={filterLang} onChange={(e)=>setFilterLang(e.target.value)}>
          {uniqueLanguages.map(lang=>(
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {filteredRepos.length ==0?(
        <p>No repositories found.</p>
      ) : (
        filteredRepos.map(repo=>(
          <div key={repo.id} className="repo-card">
            <div className="repo-header">
              <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-name">
                {repo.name}
              </a>
              <button className={`bookmark-btn ${bookmarks.find(b=>b.id===repo.id)?'active':''}`} onClick={()=>toggleBookmark(repo)}>
                {bookmarks.find(b=>b.id===repo.id)?'Bookmarked':'Bookmark'}
              </button>
            </div>
            <div className="repo-stats">
              {repo.stargazers_count} | {repo.forks_count} | {repo.language || 'N/A'}
            </div>
            <p className="repo-description">{repo.description || 'No description provided.'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default RepoList;
