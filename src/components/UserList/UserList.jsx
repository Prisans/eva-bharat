import React from 'react';
import './UserList.css';

const UserList=({users,onUserClick,loading,error})=>{
  if(loading)return <div className="status">Loading users...</div>;
  if(error)return <div className="status error">{error}</div>;
  if(users.length===0)return <div className="status">No users found. Try searching!</div>;

  return(
    <div className="user-list">
      {users.map((user)=>(
        <div key={user.id} className="user-card" onClick={()=>onUserClick(user.login)}>
          <img src={user.avatar_url} alt={user.login} className="avatar" />
          <div className="username">{user.login}</div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
