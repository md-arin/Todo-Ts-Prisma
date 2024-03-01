import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import express,{Request, Response} from 'express';

const app = express();
app.use(express.json())

const prisma = new PrismaClient();

const signupSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
    firstname: z.string(),
    lastname: z.string().optional()
}) 

type signupSchema = z.infer< typeof signupSchema>

//User Routes
app.post("/user/signup", async(req: Request, res:Response)=>{
    const { success } = signupSchema.safeParse(req.body);

    if(!success){
       return res.status(411).json({
            msg: "Wrong inputs"
        })
    }

    const user = await prisma.user.create({
        data:{
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        }
    })
    return res.status(200).json({
        msg: "User created successfully",
        user
    })
})

// async function deleteUsers(){
//     await prisma.user.deleteMany({})
// }
// deleteUsers()

const updateSchema = z.object({
    username: z.string().min(3),
    firstname: z.string(),
    lastname: z.string().optional()
})


app.put("/user/update", async(req: Request, res:Response)=>{
    const { success } = updateSchema.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            msg: "wrong inputs"
        })
    }

    const user = await prisma.user.update({
        where: {username: req.body.username},
        data: {
            firstname: req.body.firstname,
            lastname: req.body.lastname
        }
    })
    return res.status(200).json({
        msg: "User updated successfully",
        user
    })
})


//Todo Routes
const todoSchema = z.object({
    userId: z.number(),
    title: z.string(),
    description: z.string()
})

app.post("/addtodo", async(req: Request, res: Response)=>{
    const { success } = todoSchema.safeParse(req.body);
    
    if(!success){
        return res.status(411).json({
            msg: "wrong inputs"
        })
    }

    const todo = await prisma.todo.create({
        data:{
            userId : req.body.userId ,
            title : req.body.title ,
            description: req.body.description
        }
    })
    return res.status(200).json({
        msg: "Todo added",
        todo
    })
})

app.get("/todos", async(req: Request, res: Response)=>{
    const userId = req.body.userId;

    if(!userId){
        return res.status(411).json({
            msg: "Provide a userId to fetch todos"
        })
    }

    const todos = await prisma.todo.findMany({
        where: {userId}
    })
    return res.status(200).json({
        msg: "Todos fetched for the user",
        todos
    })
})



app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
});