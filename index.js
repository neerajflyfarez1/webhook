const const_express=require("express");
const const_body_parser=require("body-parser");
const const_axios=require("axios");
require('dotenv').config()

const const_app=const_express().use(const_body_parser.json());
const const_token=process.env.CONST_TOKEN;     //THIS TOKEN TO SENDING THE REQUEST
const const_mytoken=process.env.CONST_MY_TOKEN;//THIS TOKEN TO VERIFY THE WEBHOOK

const const_port = process.env.PORT || 8000;

const_app.listen(const_port,()=>{
    console.log("webhook is listening at "+const_port);
});


const_app.get("/webhook",(req,res)=>{
    let var_mode=req.query["hub.mode"];
    let var_challenge=req.query["hub.challenge"];
    let var_token=req.query["hub.verify_token"];



    if(var_mode=="subscribe" && var_token==const_mytoken){
        res.status(200).send(var_challenge);
    }
    else{
        res.status(403);
    }
});


const_app.post("/webhook",(req,res)=>{
    let var_body=req.body;

    console.log(JSON.stringify(var_body,null,2));

    if(var_body.object){
        if(var_body.entry 
            && var_body.entry[0].changes 
            && var_body.entry[0].changes[0].value.messages 
            && var_body.entry[0].changes[0].value.messages[0]
            ){
    let var_phone_id = var_body.entry[0].changes[0].value.metadata.phone_number_id;
    let var_from     = var_body.entry[0].changes[0].value.messages[0].from;
    let var_msg_body = var_body.entry[0].changes[0].value.messages[0].text.body;

        const_axios({
            method:"POST",
            url:"https://graph.facebook.com/v15.0/"+var_phone_id+"/messages?access_token="+const_token,
            data:{
                messaging_product: "whatsapp",
                to:var_from,
                text:{
                    body:"Hi, this is ebook"
                }
            },
            headers:{
                 "Content-Type":"application/json"
            }
        });

        
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    }
});

const_app.get("/",(req,res)=>{
    res.status(200).send("This is webhook setup");
});