// 存储入口
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import indexReducer from './index'
import userReducer from './user'

const reducer = combineReducers({
  index: indexReducer,
  user: userReducer
})

// 创建stroe
// const store = createStore(reducer, applyMiddleware(thunk))

// export default store

export const getServerStore= () => {
  // 服务端
  return createStore(reducer, applyMiddleware(thunk))
}

export const getClientStore = () => {
  // 通过window.__context来获取数据
  const defaultState = window.__context ? window.__context : {}
  return createStore(reducer, defaultState, applyMiddleware(thunk))
}