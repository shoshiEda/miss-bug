
//import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'


//_createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
  
}




function query(filterBy) {
    return axios.get(BASE_URL, { params: filterBy}).then(res => {
        return res.data})

    //return storageService.query(STORAGE_KEY)
}
function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
    //return storageService.get(STORAGE_KEY, bugId)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)

    //return storageService.remove(STORAGE_KEY, bugId)
}



function save(bug) {
    
    if (bug._id) {
        return axios.put(BASE_URL, bug).then(res => res.data)
        //return storageService.put(STORAGE_KEY, bug)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)

        //return storageService.post(STORAGE_KEY, bug)
    }
}




function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: "Infinite Loop Detected",
                severity: 4,
                _id: "1NF1N1T3"
            },
            {
                title: "Keyboard Not Found",
                severity: 3,
                _id: "K3YB0RD"
            },
            {
                title: "404 Coffee Not Found",
                severity: 2,
                _id: "C0FF33"
            },
            {
                title: "Unexpected Response",
                severity: 1,
                _id: "G0053"
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }



}

function getDefaultFilter(){
    return {txt:'' , severity:0, labels:'', sortBy:'', pageIdx:0}
}
