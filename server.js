const express=require('express');
const cors=require('cors');
const app=express();
const models=require('./models');
const multer=require("multer");
const port="8080";
const upload=multer({
    storage:multer.diskStorage({
        destination:function(req, file, cb){
            cb(null, "uploads/");
        },
        filename:function(req, file, cb){
            cb(null, file.originalname)
        }
    })
})


app.use(express.json());
app.use(cors()) //브라우저의 cors 이슈를 막기 위해 사용하는 코드
app.use("/uploads", express.static("uploads"));
app.get('/products', (req, res) => {
    models.Product.findAll(
        {
            /* limit:1 */
            order:[
                ["createdAt", "DESC"] /* 오름차순: ASC,  내림차순: DESC */
            ],
            attributes:["id", "name","price", "seller", "imageUrl", "createdAt"],
    
    }
    )
    .then((result)=>{
        console.log("PRODUCT:", result);
        res.send({
            product: result, 
        })
    }).catch((error)=>{
        console.error(error);
        res.status(400).send('에러발생')
    })
})

app.post('/products', (req, res) => {
    const body=req.body;
    const {name, description, seller, price, imageUrl} = body;
    if(!name|| !description|| !seller|| !price|| !imageUrl){
        res.send("모든 필드를 입력해주세요")
    }
    models.Product.create({
        name,
        description,
        seller,
        price,
        imageUrl
    }).then((result) => {
        console.log('상품생성 결과:', result);
        res.send({result, })
    }).catch((error) =>{
        console.error(error);
        res.status(400).send('문제발생')
    })
})


app.get("/products/:id", (req, res)=>{
    const params=req.params;
    const {id} = params;
    models.Product.findOne({
        where:{
            id:id,
        }
    }).then((result)=>{
        console.log("product:", result);
        res.send({
            product:result
        })
    }).catch((error)=>{
        console.error();
        res.status(400).send('상품조회가 에러가 발생함')
    })
})

app.post('/image', upload.single('image'), (req, res) =>{
    const file=req.file;
    res.send({
        imageUrl:file.path
    })
})
app.listen(port, () =>{
    models.sequelize.sync()
    .then(() =>{
        console.log('DB 연결 성공')
    })
    .catch(err =>{
        console.error(err);
        console.error('DB연결 에러');
        process.exit();
    })
});
