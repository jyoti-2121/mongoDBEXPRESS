
app.get('/',async(req,res)=>{
    let db = await payrollDb();
    let empData = await db.collection('employee').find({jobid:'job001'}).toArray();
    res.send(empData)
  })
  app.put('/createCollection',async(req,res)=>{
    let collectionname = req.body.name;
    let db = await payrollDb();
    await db.createCollection(collectionname);
    res.send({status:'ok'})
  })
  app.put('/insertone',async(req,res)=>{
    let collectiondata =req.body;  
    
    await client.db('payroll')
    .collection(collectiondata.collectionName)
    .insert([{name:'hr employeer',jobId:'job004'},{name:'production employeer',jobId:'job005'}]);
  
    res.send({status:'ok'})
  })
  app.get('/findone',async(req,res)=>{
    await payrollDb().then(async (db)=>{
      let data = await db.collection('jobsManagement').find({jobId:'job001'}).project({_id:0}).toArray()
      console.log(data,"see here.....")
      res.send(data)
    })
  })
  app.put('/simpleUpdate',async(req,res)=>{
    payrollDb().then((db)=>{
      db.collection('employee').updateOne({jobid:'ipp1'},{$set:{jobid:'job001',mobile:'90334256891',name:'siya'}},{ upsert: true }).then((val)=>{
        res.send(val)
      });
    })
  })
  app.put('/updateall',async(req,res)=>{
    payrollDb().then((db)=>{
      db.collection('employee').updateMany({},{$inc:{like: 1}}).then(()=>{
        res.send('updated')
      })
    })
  })
  app.post('/aggreation',async(req,res)=>{
    console.log("called api....");
    payrollDb().then(async(db)=>{
      let data = await db.collection('employee').aggregate(
        [
          {
            $match: {
              'jobid': 'job002',
              'like': { $gt: 1 }
            }
          }
        ]
      ).toArray();
      res.send(data)
    })
  })
  app.post('/operatorsTest',async(req,res)=>{
    await payrollDb().then(async db=>{
      let data = await db.collection('employee').find({arraytemp:{$nin:['sh3']}}).toArray()
      res.send(data)
    })
  })
  app.post('/operatorsTest',async(req,res)=>{
    await payrollDb().then(async db=>{
      let data = await db.collection('employee').find({arraytemp:{$nin:['sh3']}}).sort({name: -1}).toArray()
      res.send(data)
    })
  })
  app.post('/operatorsTest',async(req,res)=>{
    await payrollDb().then(async db=>{
      db.collection('employee').replaceOne({jobid:'ipp0'},{
        name:'lila patel',
        mobile:'9023486567',
        jobid:'job002',
        like:3
      },{upsert:true})
    })
  })
  app.post('/operatorsTest',async(req,res)=>{
    await payrollDb().then(async db=>{
      let c = await db.collection('employee').count({});
      res.send({'c':c})
    })
  })
  app.post('/operatorsTest',async(req,res)=>{
    await payrollDb().then(async db=>{
      let c = await db.collection('employee').count({});
      res.send({'c':c})
    })
  })
  app.post('/operatorsTest',async(req,res)=>{
    await payrollDb().then(async db=>{
      let c = await db.collection('jobsManagement').aggregate(
        [
          {
            $lookup: {
              from: 'employee',
              localField: 'jobId',
              foreignField: 'jobid',
              as: 'result'
            }
          }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
      ).toArray();
      res.send(c)
    })
  })
  app.post('/operatorsTest',async(req,res)=>{
    await payrollDb().then(async db=>{
      let c = await db.collection('jobsManagement').aggregate(
        [
          {
            $lookup: {
              from: 'employee',
              localField: 'jobId',
              foreignField: 'jobid',
              as: 'result'
            }
          }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
      ).toArray();
      res.send(c)
    })
  })
