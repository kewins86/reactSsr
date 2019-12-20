import React from 'react'
import { renderToString } from 'react-dom/server'
import {StaticRouter, matchPath, Route, Switch }  from 'react-router-dom'
import proxy from 'http-proxy-middleware'
import {getServerStore} from '../src/store/store'
import Header from '../src/component/Header'
import {Provider} from 'react-redux'
import express from 'express'
import routes from '../src/App'
import axios from 'axios'

const app = express()

const store = getServerStore()

app.use(express.static('public'))

// app.get('/app/*', (req, res) => {
//   axios.request({
//     method: req.method.toLocaleLowerCase(),
//     baseURL:'http://localhost:9090',
//     url:req.url,
//     data:req.body
//   }).then(r => {
//     res.send(r.data)
//   }).catch(err => {
//     console.log('err', err)
//   })
// })

// 客户端来的api开头的请求
app.use(
  'api',
  proxy({ target: 'http://localhost:9090', changeOrigin: true })
)
app.get('*', (req, res) => {
  // if(req.url.startsWith('/api/')){
  //   // 不渲染页面，使用axios转发 axios.get
  // }
  const promises = []
  // const myPromise = promiseFn => {
  //   return new Promise((resolve) => {
  //     resolve(promiseFn())
  //   }).then(res => {
  //     console.log('res', res)
  //   }).catch(err => {
  //     console.log('err', err)
  //   })
  // }
  // const rList = promises.map( item => myPromise(item))
  routes.some(route => {
    const match = matchPath(req.path, route)
    if (match) {
      const {loadData} = route.component
      if (loadData) {
        // 包装后
        // const promise = new Promise((resolve, reject) => {
        //   loadData(store).then(resolve).catch(resolve)
        // })
        // promises.push(promise)
        promises.push(loadData(store))
      };
    }
  })
  // Promise.all(promises).then(() => {
  Promise.allSettled(promises).then(() => {
    const context = {}
    // 使用renderToString，主要是接收一个react组件，并且返回一段 html结构字符串。
    const content = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url}>
          <Header></Header>
          <Switch>
            {
              routes.map(route => <Route {...route}></Route>)
            }
          </Switch>
          
        </StaticRouter>
      </Provider>
    )
    if(context.staticContext){
      res.status(context.statuscode)
    }
    if(context.action){
      res.redirect(301, context.url)
    }
    res.send(`
      <html>
        <head>
          <meta charset="utf-8" />
          <title>My react ssr</title>
        </head>
        <body>
          <div id="root">${content}</div>
          <script>
            window.__context = ${JSON.stringify(store.getState())}
          </script>
          <script src="/bundle.js"></script>
        </body>
      </html>
    `)
  }).catch(err => {
    res.send('页面报错500')
  })

})

app.listen(9091, _ => {
  console.log('监听启动')
})