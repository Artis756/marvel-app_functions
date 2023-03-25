import { Link } from "react-router-dom"
import Error from "../components/error/error"


const Page404 = () => {
	return (
		<div>
			<Error />
			<h1 style={{textAlign:'center',margin:'30px 0'}}>Page not found</h1>
			<Link to='/' style={{textAlign:'center',display:'block',fontSize:'21px',textDecoration:'underline'}}>Back to main page</Link>
		</div>
	)
}

export default Page404