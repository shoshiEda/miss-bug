
const { useState, useEffect } = React


export function FilterBugs({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function onSetFilterBy(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        console.log(field,value)
        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }


    const { txt, severity, labels } = filterByToEdit
    return (
        <section className="bug-filter main-layout full">
            <fieldset>
                <legend>Filter Our Bugs</legend>
            <form onSubmit={onSetFilterBy} >
                <label htmlFor="txt">Title: </label>
                <input value={txt} onChange={handleChange} type="text" id="txt" name="txt" />

                <label htmlFor="severity">Severity: </label>
                <input value={severity || ''} onChange={handleChange} type="number" id="severity" name="severity" />
                < br />
                <label htmlFor="labels">Label: </label>
                <input value={labels || ''} onChange={handleChange} type="text" id="labels" name="labels" list="labeles" />
                <datalist id="labeles">
                    <option value="critical" />
                    <option value="need-CR" />
                    <option value="dev-branch" />
                </datalist>

                <label htmlFor="sortBy">Sort by: </label>
                <select name="sortBy" onChange={handleChange}>
                    <option value=""> Select</option>
                    <option value="title"> By title</option>
                    <option value="severity"> By severity</option>
                    <option value="createdAt"> By created date</option>
                </select>

                <button>Submit</button>
            </form>
            </fieldset>
        </section>
    )
}
