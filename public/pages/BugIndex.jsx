import { bugService } from '../services/bug.service.js'
import { utilService } from '../services/util.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { FilterBugs } from '../cmps/FilterBugs.jsx'

const { useState, useEffect ,useRef } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const debounceOnSetFilter = useRef(utilService.debounce(onSetFilter, 500))
    const [maxPage,setMaxPage]=useState(1)
    

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
        .then(({bugs,maxPage}) => {
            setMaxPage(maxPage)
            setBugs(bugs)
        })
        .catch(err => console.log('err:', err))
    }

    function onChangePageIdx(diff) {
        if(filterBy.pageIdx+diff>=maxPage) return
        setFilterBy(prevFilter => {
            let newPageIdx = prevFilter.pageIdx + diff
            if (newPageIdx < 0) newPageIdx = 0
            return { ...prevFilter, pageIdx: newPageIdx }
        })
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onSetFilter(filterBy) {
        if(filterBy.txt || filterBy.severity>0 || filterBy.Labels)
        setFilterBy(prevFilter => ({
            ...prevFilter,
            ...filterBy,
            pageIdx: 0
        }))
else
        setFilterBy(prevFilter => ({
            ...prevFilter,
            ...filterBy,
        })
        )
        console.log(filterBy)
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
        }
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    return (
        <main>
            <h3>Bugs App</h3>
            <main>
                <FilterBugs filterBy={filterBy} onSetFilter={debounceOnSetFilter.current} />
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
                <div className='pagination'>
                    <button onClick={() => onChangePageIdx(-1)}>prev page</button>
                    <button onClick={() => onChangePageIdx(1)}>next page</button>
                </div>
            </main>
        </main>
    )
}
