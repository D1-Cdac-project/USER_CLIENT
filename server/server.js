const express=require('express');
const app=express();


app.get('/',(req,res)=>{
    res.send("this is get request")
})

app.listen('localhost',4000,()=>{
    console.log("Server is running on port 4000")
})