const express = require('express')
const app = express()

app.get('/api/course/list', (req,res) => {
  // res.header('Access-Control-Allow-Origin','*')
  // res.header('Access-Control-Allow-Methods','GET,POST,PUT,DELETE')
  // res.header('Content-Tpye',"application/json;charset=utf-8")
  res.json({
    code: 0,
    list: [
      {name:'商品1', id:1},
      {name:'商品2', id:2},
      {name:'商品3', id:3},
      {name:'商品4', id:4},
    ]
  })
})

app.get('/api/user/info', (req,res) => {
  // res.header('Access-Control-Allow-Origin','*')
  // res.header('Access-Control-Allow-Methods','GET,POST,PUT,DELETE')
  // res.header('Content-Tpye',"application/json;charset=utf-8")
  res.json({
    code: 0,
    data: {
      name:'kkb', 
      best: 'aaa'
    },
  })
})
app.listen(9090,() => {
  console.log('mock启动完毕')
})