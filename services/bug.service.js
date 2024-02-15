import fs from 'fs'
import { utilService } from "./util.service.js";
import { loggerService } from './logger.service.js'


const PAGE_SIZE = 3
export const bugBackService = {
    query,
    getById,
    remove,
    save,
   
}

const bugs = utilService.readJsonFile('data/bug.json')


function query(filterBy) {
    console.log(filterBy)
    let bugsToReturn = bugs

    if(filterBy.userId){
        bugsToReturn = bugsToReturn.filter(bug => (bug.creator && bug.creator._id===filterBy.userId))
    return Promise.resolve(bugsToReturn)
    }
   
        if (filterBy.txt) {
        
            const regExp = new RegExp(filterBy.txt, 'i')
            bugsToReturn = bugsToReturn.filter(bug => regExp.test(bug.title))
        }
        if (filterBy.severity>0) {
            
            bugsToReturn = bugsToReturn.filter(bug => bug.severity <= filterBy.severity)
        }

        if (filterBy.labels) {
            bugsToReturn = bugsToReturn.filter(bug => bug.labels.some(label => filterBy.labels.includes(label)))
        }

        if (filterBy.sortBy==='title') {
            bugsToReturn = bugsToReturn.sort((b1,b2)=>b1.title.localeCompare(b2.title))
        }

        else if (filterBy.sortBy==='severity') {
            bugsToReturn = bugsToReturn.sort((b1,b2)=>b2.severity - b1.severity)
        }

        else if (filterBy.sortBy==='createdAt') {
            bugsToReturn = bugsToReturn.sort((b1,b2)=>b2.createdAt - b1.createdAt)
        }
        const maxPage=Math.ceil(bugsToReturn.length/PAGE_SIZE)
    

        if (filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
        }
    
    return Promise.resolve({bugs: bugsToReturn,maxPage})
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug dosent exist!')

    return Promise.resolve(bug)
}

function remove(bugId , loggedinUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No Such bug')
    const bug = bugs[idx]
    if (!loggedinUser.isAdmin &&
        bug.owner._id !== loggedinUser._id) {
        return Promise.reject('Not your bug')
    }
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bug, loggedinUser) {
    console.log(bug, loggedinUser)
    

    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        if (!loggedinUser.isAdmin &&
            carToUpdate.owner._id !== loggedinUser._id) {
            return Promise.reject('Not your bug')
        }
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bug.createdAt=Date.now()
        bug.creator = loggedinUser
        bugs.unshift(bug)
        console.log(bug)
    }

    return _saveBugsToFile().then(() => bug)
}


function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        })
    })
}