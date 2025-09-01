import { Link } from "react-router-dom"
import Style from "./Menu.module.css"
function Menu(){
return (
    <header className={Style.header}>
    <nav><ul>
        <li><Link to = "/quiz">Create Quiz</Link></li>
        <li><Link to = "/leaderboard/:quizId">Leaderboard</Link></li>
        <li><Link to = "/bookmark">Bookmark Question</Link></li>
        {/* <li><Link to = "/questionlog">Question Log</Link></li> */}
        <li><Link to = "/my-quizzes">My quizzes</Link></li>
        <li><Link to = "/Report">Report</Link></li>
        <li><Link to = "/">Register</Link></li>
        <li><Link to = "/login">Sign in</Link></li>
        <li><Link to = "/dashboard">User Account</Link></li>
        </ul></nav>
        </header>
)
}
export default Menu