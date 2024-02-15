const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'


export function UserDetails() {

    const user = userService.getLoggedinUser()
    const { userId } = useParams()

 


console.log(user,user.bugs)
    if (user._id!==userId) return <h1>Error! you are not the user</h1>
    if (!user) return <h1>loadings....</h1>
    return(
        <section className='user-details'>
        <h1>hello{user.fullname}</h1>
        {(!user.bugs || !user.bugs.length) && <h2>you have no bugs yet...</h2>}

        {user.bugs && user.bugs.length>0 &&
        <section>
        <h2>your bugs are:</h2>
                <BugList bugs={user.bugs} isUser={true} />
                </section>
        }
        </section>
    )
}