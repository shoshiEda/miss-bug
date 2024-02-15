const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'


export function UserDetails() {

    const user = userService.getLoggedinUser()
    const { userId } = useParams()
    const [userBugs,setUserBugs]=useState(null)

  
  useEffect(() => {
    if (user._id===userId || user.isAdmin)
    getBugsByUser(userId)
}, [])
  
  
  
    function getBugsByUser(userId)
  {
    const filterBy={
        userId
    }
    bugService.query(filterBy)
    .then(bugs=>setUserBugs(bugs))
    .catch(err=> showErrorMsg(err))
  }
    




    if (user._id!==userId && !user.isAdmin) return <h1>Error! you are not the user</h1>
    if (!user) return <h1>loadings....</h1>
    return(
        <section className='user-details'>
        <h1>hello{user.fullname}</h1>
        {!userBugs && <h2>you have no bugs yet...</h2>}

        {userBugs &&
        <section>
        <h2>your bugs are:</h2>
                <BugList bugs={userBugs} isUser={true} />
                </section>
        }
        </section>
    )
}