import React from 'react'
import { renderToString } from 'react-dom/server'
import {StaticRouter, matchPath, Route }  from 'react-router-dom'
import {getServerStore} from '../src/store/store'
import Header from '../src/component/Header'
import {Provider} from 'react-redux'
import express from 'express'
import routes from '../src/App'
import axios from 'axios'

const app = express()

const store = getServerStore()

app.use(express.static('public'))

app.get('/app/*', (req, res) => {
  axios.request({
    method: req.method.toLocaleLowerCase(),
    baseURL:'http://localhost:9090',
    url:req.url,
    data:req.body
  }).then(r => {
    res.send(r.data)
  }).catch(err => {
    console.log('err', err)
  })
})
app.get('*', (req, res) => {
  const promises = []
  const myPromise = promiseFn => {
    return new Promise((resolve) => {
      resolve(promiseFn())
    }).then(res => {
      console.log('res', res)
    }).catch(err => {
      console.log('err', err)
    })
  }
  const rList = promises.map( item => myPromise(item))
  routes.some(route => {
    const match = matchPath(req.path, route)
    if (match) {
      const {loadData} = route.component
      if (loadData) {
        promises.push(loadData(store))
      }
    }
  })
  Promise.all(rList).then(() => {
    const content = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url}>
          <Header></Header>
          {
            routes.map(route => <Route {...route}></Route>)
          }
        </StaticRouter>
      </Provider>
    )
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