const express =require('express');
const app=express();
const cors=require('cors');
const mysql=require('mysql');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));



const conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'test'
})



conn.connect((err)=>{
    if(err){
        console.log("datbase connection fail");
    }else{
        console.log("Connection sucess");
    }
})



app.get("/outofstock",(req,res)=>{
    const query=(`SELECT * FROM Products WHERE Products.Product_id NOT IN (SELECT product_id FROM stock)`)
    conn.query(query,(err,data)=>{
       if(err) throw err
       res.send(data)
    })
})

app.post("/addproduct",(req,res)=>{
    const Product_id=parseInt(req.body.Product_id);
    const Product_name=req.body.Product_name;
    conn.query('insert into Products(Product_id,Product_name) values(?,?)',[Product_id,Product_name],(err,data)=>{
        if(err) throw err;
        res.send({"Message":"Product add successful"});
    })
})


app.post("/orderproduct",(req,res)=>{
    const Product_id=parseInt(req.body.Product_id);
    conn.query('insert into deliverylist(Product_id) values(?)',[Product_id],(err,data)=>{
        if(err) throw err;
        res.send({"Message":"Order successful"});
    })
})

app.get("/deliverlist",(req,res)=>{
    conn.query(`delete from DeliveryList`,(err,data)=>{
        res.send(data);
    })
})

const PORT=process.env.PORT|5000;
app.listen(PORT,()=>console.log(`server running on port${PORT}`));