"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
const signupSchema = zod_1.z.object({
    username: zod_1.z.string().min(3),
    password: zod_1.z.string().min(6),
    firstname: zod_1.z.string(),
    lastname: zod_1.z.string().optional()
});
//User Routes
app.post("/user/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg: "Wrong inputs"
        });
    }
    const user = yield prisma.user.create({
        data: {
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        }
    });
    return res.status(200).json({
        msg: "User created successfully",
        user
    });
}));
// async function deleteUsers(){
//     await prisma.user.deleteMany({})
// }
// deleteUsers()
const updateSchema = zod_1.z.object({
    username: zod_1.z.string().min(3),
    firstname: zod_1.z.string(),
    lastname: zod_1.z.string().optional()
});
app.put("/user/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = updateSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg: "wrong inputs"
        });
    }
    const user = yield prisma.user.update({
        where: { username: req.body.username },
        data: {
            firstname: req.body.firstname,
            lastname: req.body.lastname
        }
    });
    return res.status(200).json({
        msg: "User updated successfully",
        user
    });
}));
//Todo Routes
const todoSchema = zod_1.z.object({
    userId: zod_1.z.number(),
    title: zod_1.z.string(),
    description: zod_1.z.string()
});
app.post("/addtodo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = todoSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg: "wrong inputs"
        });
    }
    const todo = yield prisma.todo.create({
        data: {
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description
        }
    });
    return res.status(200).json({
        msg: "Todo added",
        todo
    });
}));
app.get("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    if (!userId) {
        return res.status(411).json({
            msg: "Provide a userId to fetch todos"
        });
    }
    const todos = yield prisma.todo.findMany({
        where: { userId }
    });
    return res.status(200).json({
        msg: "Todos fetched for the user",
        todos
    });
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
