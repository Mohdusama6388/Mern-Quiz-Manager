import Styles from './Layout.module.css'
import Menu from './Menu'
function Layout(props){
return <div className={Styles.Main}> 
   <main><Menu/></main>
    {props.children}
</div>
}
export default Layout;
