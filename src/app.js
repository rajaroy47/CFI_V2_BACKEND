const express = require('express');
const cors = require("cors");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res)=>{
    res.send("This is Home Route");
})

const post = [
    {
        id: 1,
        authorId: 1,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 2,
        authorId: 2,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 3,
        authorId: 3,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 4,
        authorId: 4,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 5,
        authorId: 5,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 6,
        authorId: 6,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 7,
        authorId: 7,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 8,
        authorId: 8,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 9,
        authorId: 9,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 10,
        authorId: 10,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 11,
        authorId: 11,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 12,
        authorId: 12,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 13,
        authorId: 13,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 14,
        authorId: 14,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 15,
        authorId: 15,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 16,
        authorId: 16,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 17,
        authorId: 17,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 18,
        authorId: 18,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 19,
        authorId: 19,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
        id: 20,
        authorId: 20,
        title: "How to build a simple blog with node and express",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
]

app.get("/post", (req, res)=>{
    res.send(post)
})


module.exports = app;
