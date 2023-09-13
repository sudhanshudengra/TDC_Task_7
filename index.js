import express from 'express';
import { PrismaClient } from '@prisma/client';
const app = express()
const prisma = new PrismaClient()

app.use(express.json())

app.get('/passengers', async (req, res) => {
    try {
        const passenger = await prisma.passenger.findMany()
        if (passenger) {
            res.json(passenger)
        }
    } 
    catch (error) {
        console.log(error)
        res.status(402).json({ error: 'Error getting passengers' })
    }
})

//get passenger from id
app.get('/passengers/:id', async (req, res) => {
    try {
        const passenger = await prisma.passenger.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                booking: true,
        }
        }
        )
        if (!passenger) {
           return res.status(404).send("passenger not found")
        }
        res.status(200).send(passenger)
    }
     catch (error) {
        console.log(error)
        res.status(402).send("passenger not found")
    }
})

app.post('/passengers', async (req, res) => {
    const details = req.body
    try{
        const passenger = await prisma.passenger.create({
            data: {
                name: details.name,
                email: details.email,
                dob: details.dob,
                gender: details.gender,
            }
        })
        res.status(201).send("passenger added")
    } 
    catch (error) {
        console.log(error)
        res.status(402).send("passenger not added")
    }
})

app.patch('/passengers/:id', async (req, res) => {
    try{
        const passenger = await prisma.passenger.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                name: req.body.name,
            }
        })
        if (!passenger) {
            return res.status(404).send("passenger not found")
        }
        res.status(200).send("passenger updated") 
    } 
    catch (error) {
        console.log(error)
        res.status(402).send("passenger not updated")
    }
})

app.delete('/passengers/:id', async (req, res) => {
    try{
        const passenger = await prisma.passenger.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        if (!passenger) {
           return res.status(404).send("passenger not found")
        }
        res.status(200).send("passenger deleted")
    }
    catch (error) {
        console.log(error)
        res.status(402).send("passenger not deleted")
    }
}) 

app.listen(3020, () => {
  console.log('Server is running on port 3020')
})

prisma.$disconnect();