import fs from 'fs'
import { utilService } from "./utils.service.js";

const PAGE_SIZE = 3
export const bugBackService = {
    query,
    getById,
    remove,
    save,
   
}

const bugs = utilService.readJsonFile('data/bug.json')
//console.log(bugs)




function query(filterBy) {
    let bugsToReturn = bugs

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

    if (filterBy.sortBy==='severity') {
        bugsToReturn = bugsToReturn.sort((b1,b2)=>b2.severity - b1.severity)
    }

    if (filterBy.sortBy==='createdAt') {
        bugsToReturn = bugsToReturn.sort((b1,b2)=>b2.createdAt - b1.createdAt)
    }

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }
    return Promise.resolve(bugsToReturn)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug dosent exist!')

    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    console.log(bug)

    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bug.createdAt=Date.now()
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