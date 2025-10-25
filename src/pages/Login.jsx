import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import api from '../services/api'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        const { data } = await api.post('/auth/register', { name, email, password })
        if (data?.token) {
          localStorage.setItem('token', data.token)
          navigate('/productos')
        }
      } else {
        const { data } = await api.post('/auth/login', { email, password })
        if (data?.token) {
          localStorage.setItem('token', data.token)
          navigate('/productos')
        }
      }
    } catch (err) {
      // Manejo específico para credenciales inexistentes/incorrectas
      const status = err?.response?.status
      if (status === 401) {
        setError('Usuario o contraseña no válidos. Si no tienes cuenta, cambia a "Registro" y créala primero.')
      } else if (axios.isAxiosError(err) && err.code === 'ERR_NETWORK') {
        setError('No se pudo conectar con el servidor. Verifica que el backend esté activo en http://localhost:5000.')
      } else {
        setError(err?.response?.data?.message || 'Error de autenticación')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 360, border: '1px solid #ddd', borderRadius: 8, padding: 24 }}>
        <h2 style={{ marginBottom: 8 }}>{mode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
        <p style={{ marginTop: 0, color: '#666' }}>Stack MERN • MongoDB Atlas • Express • React • Node</p>

        <div style={{ margin: '16px 0' }}>
          <button onClick={() => setMode('login')} style={{ marginRight: 8, padding: '6px 12px', background: mode==='login'?'#2f7cff':'#eee', color: mode==='login'?'#fff':'#333', border: 'none', borderRadius: 4 }}>Login</button>
          <button onClick={() => setMode('register')} style={{ padding: '6px 12px', background: mode==='register'?'#2f7cff':'#eee', color: mode==='register'?'#fff':'#333', border: 'none', borderRadius: 4 }}>Registro</button>
        </div>

        <form onSubmit={onSubmit}>
          {mode === 'register' && (
            <div style={{ marginBottom: 12 }}>
              <label>Nombre</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Tu nombre" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@email.com" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          </div>
          {error && <div style={{ color: 'white', background:'#d33', padding: '8px 10px', borderRadius: 6, marginBottom: 12 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, borderRadius: 4, border: 'none', background: '#2f7cff', color: '#fff', fontWeight: 600 }}>
            {loading ? 'Procesando...' : (mode === 'register' ? 'Crear cuenta' : 'Entrar')}
          </button>
        </form>
      </div>
    </div>
  )
}