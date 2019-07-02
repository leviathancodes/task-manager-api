const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/authentication')

// Create a new task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        await res.status(201).send(task)
    } catch (e) {
         res.status(400).send(e)
    }
})
// Get all tasks

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt_desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    
    if (req.query.sortBy) {
        const sortQuery = req.query.sortBy.split("_")
        sort[sortQuery[0]] = sortQuery[1] === "asc" ? -1 : 1
    }
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }


    try {
        await req.user.populate({
        path: 'tasks',
        match,
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
       }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})
// Get task by its ID
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
         res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }

})
// Update task by its ID
router.patch('/tasks/:id', auth, async (req, res) => {
    
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

        try {
        const task = await Task.findOne({ _id: req.params.id , owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }

})
// Delete task by its ID
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id , owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }   
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
    
})  


module.exports = router