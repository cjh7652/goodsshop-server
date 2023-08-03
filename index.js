const express=require('express');
const cors=require('cors');
const app=express();
const port="8080";


app.use(express.json());
app.use(cors()) //브라우저의 cors 이슈를 막기 위해 사용하는 코드
app.get('/products', (req, res) => {
    const query=req.query;
    console.log('queryString:', query)
    res.send({
        products: [
            {id:0, name : "독버섯조명", price:89000, seller : "유니스", imageUrl:"img/products/product01.jpg"},
            {id:1, name : "허리아작의자", price:91000, seller : "더휴먼", imageUrl:"img/products/product02.jpg"},
            {id:2, name : "잘록거울", price:180000, seller : "더부엌", imageUrl:"img/products/product03.jpg"}
        ]
    })
})

app.post('/products', (req, res) => {
    const body=req.body;
    res.send({
        body,
    })
})


app.get("/products/:id", (req, res)=>{
    const params=req.params;
    const {id} = params;
    res.send(`id는 ${id} 입니다`);
})
app.listen(port, () =>{
    console.log('server on')
});
