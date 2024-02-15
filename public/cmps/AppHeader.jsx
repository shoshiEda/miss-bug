import {UserMsg} from './UserMsg.jsx'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { LoginSignup } from './LoginSignup.jsx'

const {NavLink,Link} = ReactRouterDOM
const {useState} = React
const { useNavigate } = ReactRouter



export function AppHeader() {

  const navigate = useNavigate()

  const [user, setUser] = useState(userService.getLoggedinUser())

  function onLogout() {
    userService.logout()
        .then(()=>{
            onSetUser(null)
        })
        .catch((err) => {
            showErrorMsg('OOPs try again')
        })
}

function onSetUser(user) {
    setUser(user)
    navigate('/')
}
 


  return (
    <header>
      <UserMsg />
      <h1>Bugs are Forever</h1>

      <nav>
        <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
        <NavLink to="/about">About</NavLink>
      </nav>
      {user ? (
                < section >

                    <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                    {user.isAdmin && <button><Link to={`/admin`}></Link>Users list</button>}
                    <button onClick={onLogout}>Logout</button>
                </ section >
            ) : (
                <section>
                    <LoginSignup onSetUser={onSetUser} />
                </section>
            )}
    </header>
  )
}
