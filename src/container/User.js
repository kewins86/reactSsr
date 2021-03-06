import React from 'react';
import { connect } from 'react-redux';
import { getUserInfo } from '../store/user'
function User(props){
  console.log(props,props)
  return <div>
    <h1>你好！ {props.userinfo.name}, 最棒的{props.userinfo.best}</h1>
  </div>
}
User.loadData = (store) => {
  return store.dispatch(getUserInfo())
}
export default connect(
  state => {
    console.log(state,state)
    return {userinfo: state.user.userinfo}
  }
)(User);

