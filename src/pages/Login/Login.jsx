import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import logo from '../../assets netflix/logo.png' 
import { login, signup } from '../../firebase'
import netflix_spinner from '../../assets netflix/netflix_spinner.gif'

function Login() {
  const navigate = useNavigate()
  const [signInState, setSignInState] = useState("Sign In")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const userAuth = async (event) => {
    event.preventDefault()
setLoading(true)
    const user =
      signInState === "Sign In"
        ? await login(email, password)
        : await signup(username, email, password)
    
    if (user) {
      navigate('/')
    }
setLoading(false)
  }
//git and git b are the same file, just different versions. Ignore the differences in the file and use the most recent version of the file for the final code.
  return (
    loading?<div className="login__spinner">
      <img src={netflix_spinner} alt="" />
    </div>:
    <div className='login'>
      <img src={logo} className='login__logo' alt="" />
      <div className="login__form">
        <h1>{signInState}</h1>
        <form onSubmit={userAuth}>
          <div className="inputs">
          {signInState === "Sign Up" ? 
          <input value={username} onChange={(event) => {setUsername(event.target.value)}} type="text" placeholder="Username"/> : <></>}
          <input value={email} onChange={(event) => {setEmail(event.target.value)}} type="email" placeholder="Email"/>
          <input value={password} onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password"/>
          <button type='submit'>{signInState}</button>
          </div>
          <div className="form__help">
            <div className="remember">
              <input type="checkbox"/>
                <label htmlFor="">Remember Me</label>
              </div>
              <div className="help">
              <p>Need Help?</p>
            </div>
          </div>
        </form>
<div className="form__switch">
  {signInState === "Sign In" ? <p>New to Netflix? <span onClick={() => {setSignInState("Sign Up") }}> Sign Up Now</span></p>
  : <p>Already Have an Account? <span onClick={() => {setSignInState("Sign In") }}> Sign In</span></p>
  }
  
  
</div>
      </div>
    </div>
  )
}

export default Login
