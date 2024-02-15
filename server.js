import { bugBackService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
import { loggerService } from './services/logger.service.js'
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()


// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        severity: req.query.severity || 0,
        labels: req.query.labels || '',
        pageIdx: req.query.pageIdx,
        sortBy: req.query.sortBy || ''
    }
    bugBackService.query(filterBy)
        .then(bugs =>  res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.post('/api/bug', (req, res) => {

    const bugToSave = {
        title: req.body.title,
        severity: req.body.severity,
        description: req.body.description,
    }

    bugBackService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})


// Edit Car (UPDATE)
app.put('/api/bug', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        severity: req.body.severity,
        description: req.body.description,
        _id: req.body._id
    }

    bugBackService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.get('/api/bug/:id', (req, res) => {
    console.log('hi')

    const bugId = req.params.id
    bugBackService.getById(bugId)
        .then(bug => {
            let visitedBugs=req.cookies.visitedBugs || []
            if(visitedBugs.includes(bug._id)) return res.send(bug)
            visitedBugs.push(bug._id)
            res.cookie('visitedBugs', visitedBugs,{ maxAge: 1000 * 300 })

            if(visitedBugs.length>3)
            return res.status(401).send('Wait for a bit')
            return res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

// Remove Car (DELETE)
app.delete('/api/bug/:id', (req, res) => {
    const bugId = req.params.id
    bugBackService.remove(bugId)
        .then(() => res.send(bugId))
        .catch((err) => {
            loggerService.error('Cannot remove car', err)
            res.status(400).send('Cannot remove car')
        })
})

// AUTH API

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})



const port = 3030
app.listen(port, () =>
loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)