import './login.css'
import { Link, useHistory } from "react-router-dom"
import Input from '../../components/shared/Input'
import Button from '../../components/shared/Button'
import { useState } from 'react'
import { validateFormData } from '../../helpers'
import { useDispatch } from 'react-redux'
import { actLoginAsync } from '../../store/auth/actions'
import { useNotAuthenticated } from '../../hooks/useNotAuthenticated'
import { Trans, plural, t } from "@lingui/macro"

function LoginPage() {
  useNotAuthenticated()
  
  const history = useHistory()
  const dispatch = useDispatch()
  const [isFormDirty, setIsFormDirty] = useState(true)
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: {
      value: 'congluc1902',
      error: ''
    },
    password: {
      value: '231313',
      error: ''
    }
  })


  function handleOnChange(evt) {
    const name = evt.target.name
    const value = evt.target.value.trim()
    const error = validateFormData({ value, name })

    setFormData({
      ...formData,
      [name]: {
        value,
        error
      }
    })
    setIsFormDirty(true)
  }

  function checkFormIsValid() {
    if (!isFormDirty) {
      setFormData({
        username: { 
          value: '', 
          error: validateFormData({
            value: '',
            name: 'username'
          }) 
        },
        password: {
          value: '',
          error: validateFormData({
            value: '',
            name: 'password'
          })
        },
      })
      return false
    }

    if (formData.username.error || formData.password.error) {
      return false
    }

    return true
  }

  function handleSubmit(evt) {
    evt.preventDefault()

    const isValid = checkFormIsValid()

    if (!isValid) {
      console.log('Form Error ...')
      return
    }
    const { username, password } = formData
    
    if (loading) {
      return
    }

    setLoading(true)
    setFormError('')


    dispatch(actLoginAsync(username.value, password.value))
      .then(res => {
        if (res.ok) {
          history.push('/')
        } else {
          setFormError(res.error)
          setLoading(false)
        }
      })
  }

  const nickname = 'Tu???n'
  const urlUser = '/user/tuan'
  const count = 1

  return (
    <main className="login">
      <div className="spacing" />
      <div className="tcl-container">
        <div className="tcl-row">
          <div className="tcl-col-12 tcl-col-sm-6 block-center">
            <h1 className="form-title text-center"><Trans>????ng nh???p</Trans></h1>
            <h1 className="form-title text-center"><Trans>Ch??o bu???i s??ng, {nickname}</Trans></h1>
            <h1 className="form-title text-center"><Trans>Ch??o bu???i s??ng, <Link to={urlUser}>{nickname}</Link></Trans></h1>
            <h1>
              { plural(count, {
                one: `${count} B??nh lu???n`,
                other: `${count} B??nh lu???n`,
              }) }
            </h1>
            <div className="form-login-register">
              { formError && <p className="form-login__error">{formError}</p> }
              <form autoComplete="off" onSubmit={handleSubmit}>
                <Input 
                  label="T??n ????ng nh???p" 
                  placeholder={t`Nh???p t??n ????ng nh???p ...`}
                  autoComplete="off"
                  value={formData.username.value}
                  error={formData.username.error}
                  name="username"
                  onChange={handleOnChange}
                  isShowError
                />
                <Input 
                  type="password" 
                  label="M???t kh???u" 
                  placeholder="Nh???p m???t kh???u c???a b???n ..."
                  autoComplete="new-password"
                  value={formData.password.value}
                  error={formData.password.error}
                  name="password"
                  onChange={handleOnChange}
                  isShowError
                />

                <div className="d-flex tcl-jc-between tcl-ais-center">
                  <Button type="primary" size="large" loading={loading}>????ng nh???p</Button>
                  <Link to="/register">????ng k??</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="spacing" />
    </main>

  )
}

export default LoginPage