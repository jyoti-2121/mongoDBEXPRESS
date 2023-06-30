const { MongoClient } = require('mongodb')
const url= 'mongodb://127.0.0.1:27017';

const databaseName='payroll'
const client= new MongoClient(url);
async function payrollDb(){    
    await client.connect();
    console.log('Connected successfully to server')
    return await client.db(databaseName)    
}
async function saayamdb(){    
    await client.connect();
    console.log('Connected successfully to server')
    return await client.db('saayam')    
}

module.exports = {payrollDb,client, saayamdb}