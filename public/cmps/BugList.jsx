import { BugPreview } from './BugPreview.jsx'
import { userService } from "../services/user.service.js";

const { Link } = ReactRouterDOM


export function BugList({ bugs, onRemoveBug, onEditBug,isUser }) {

    const user = userService.getLoggedinUser()
   


    function isOwner(bug) {
        if (!user) return false
        return  user.isAdmin || bug.creator._id === user._id
    }

    if (!bugs) return <div>Loading...</div>
    return (
        <section>
        {!isUser && <ul className="bug-list">
            {bugs.map((bug) => (
    
            <li key={bug._id} className="bug-preview" >
                    
                    <BugPreview bug={bug} />
                    {isOwner(bug) &&  (<div>
                        <button onClick={() => onRemoveBug(bug._id)}>x</button>
                        <button onClick={() => onEditBug(bug)}>Edit</button>
                        </div>
                    )}
                    <Link to={`/bug/${bug._id}`}>Details</Link>
                   
                    </li>
    ))}
        </ul >}
        {isUser && <ul className="user-bug-list">
            {bugs.map((bug) => (
            <li key={bug._id} className="user-bug" >{bug.title}</li>
    ))}
        </ul >}
        </section>
    )}
