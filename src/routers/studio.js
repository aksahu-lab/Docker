const express = require('express')
const StudioUser = require('../models/studioUser')
const Album = require('../models/album')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/signup', async (req, res) => {
    const user = new StudioUser(req.body)

    try {
        await user.save()
        console.log('user details: ', user)
        const token = await user.generateAuthToken()
        console.log('token: ', token)
        res.status(201).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

router.post('/signin', async (req, res) => {
    try {
        console.log('req.body.mobile: ', req.body.mobile)
        console.log('req.body.mobile: ', req.body.password)
        const user = await StudioUser.findByCredentials(req.body.mobile, req.body.password)
        console.log('req.body.mobile:', user)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

router.post('/signout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/createAlbum', auth, async (req, res) => {
    console.log('creating album!!')
    const album = new Album({
        ...req.body,
        studio: req.user._id
    })

    try {
        await album.save()
        res.status(201).send(album)
    } catch (e) {
        res.status(400).send(e.message)
    }
})


router.get('/albums', auth, async (req, res) => {
    const match = {}
    if (req.body.eventType) {
        match.eventType = req.body.eventType
    }
    if (req.body.status) {
        match.status = req.body.status
    }
    try {
        await req.user.populate('albums')
        await req.user.populate({
            path: 'albums',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        })
        res.send(req.user.albums)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router