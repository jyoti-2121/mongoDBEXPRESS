const express = require('express');
const app = express();
const port = 8000;
let body = require('body-parser');
let _ = require('lodash')
app.use(body.json())
let {saayamdb} = require('./config/mongo')
require('./config/mongo')
app.get('/user/getData',async(req,res)=>{
  try{
    let params = req.query; 
    let qry = {};
    let matchArr = [];
    if(params.first_name && params.first_name != ''){
      matchArr.push({'first_name': params.first_name})
    }
    if(params.last_name && params.last_name != ''){
      matchArr.push({'last_name': params.last_name})
    }
    if(params.email && params.email != ''){
      matchArr.push({'email': params.email})
    }
    if(params.phone && params.phone != ''){
      matchArr.push({'phone': params.phone})
    }
    if(!_.isEmpty(matchArr)){
      qry['$or'] = matchArr;
    }
    const skip = (Number(params.pageno > 0 ? params.pageno : 1) - 1) * Number(params.perpageRec > 0 ? params.perpageRec : 5); // assuming pageNo starts from 1
    const limit = Number(params.perpageRec > 0 ? params.perpageRec : 5);
    await saayamdb().then(async (db)=>{
      let data = await db
      .collection('user')
      .aggregate([
        {
          $match: qry
        },
        {
          $lookup: {
            from: 'request',
            let: { uid: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$user_id', '$$uid']
                  }
                }
              }
            ],
            as: 'total_request'
          }
        },
        { $match: { total_request: { $ne: [] } }},
        {
          $project: {
          _id: 1,
          total_count: { $size: '$total_request' },
          phone: {
            $concat: ['$phone_code', ' ', '$phone']
          },
          email: 1,
          image: {
            $ifNull: [
              'n/a',
              {
                $concat: [
                  'https://saayam.s3.ap-south-1.amazonaws.com/saayam-staging/user/',
                  '$image'
                ]
              }
            ]
          },
          active_type: {
            $cond: {
              if: { $eq: ['$is_donor', true] },
              then: 'donor',
              else: {
                $cond: {
                  if: {
                    $eq: ['$is_volunteer', true]
                  },
                  then: 'volunteer',
                  else: 'user'
                }
              }
            }
          },
          createdAt: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          }
          }
        },
        { $limit: Number(limit) },
        { $skip: Number(skip) },
        { $sort: { createdAt: -1 } }
      ]).toArray();
      res.send(data);
    })
  }catch(error){
    res.send(error);
  }
})
app.get('/user/allcounts',async(req,res)=>{
  try{
    await saayamdb().then(async (db)=>{
      // let data = await db.collection('user').aggregate([{ $sortByCount: "$gender" }]).toArray()
      // let data = await db.collection('user').aggregate([{ $group:{
      //   _id: '$gender',count: {$sum:1}
      // } }]).toArray()
      let data = await db.collection('request').aggregate(
        [
          {
            $lookup: {
              from: 'categories',
              let: { uid: '$category_slug' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$category_slug', '$$uid']
                    }
                  }
                },
                { $project: { _id: 1, name: 1 } }
              ],
              as: 'category'
            }
          },
          { $project: { _id: 1, category_slug: 1,category:1 } }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
      ).toArray();
      res.send(data)
    })
  }catch(error){
    console.error(error)
  }
})

app.listen(port, (err) => {
  if (err)
    throw err;
  else
    console.log(`Server is running on port ${port}`);
});