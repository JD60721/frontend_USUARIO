import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const ITEMS = [
  { id: 'cocacola', label: 'CocaCola' },
  { id: 'pepsi', label: 'Pepsi' },
  { id: 'fanta', label: 'Fanta' },
  { id: 'jugohit', label: 'Jugo Hit' },
]

export default function Products() {
  const navigate = useNavigate()
  const [quantities, setQuantities] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
  }, [navigate])

  const updateQuantity = (id, value) => {
    const qty = parseInt(value) || 0
    setQuantities((prev) => ({
      ...prev,
      [id]: qty > 0 ? qty : 0
    }))
  }

  const saveSelection = async () => {
    setMessage('')
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return navigate('/login')
      
      const items = Object.entries(quantities)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => ({
          productId: id,
          name: ITEMS.find((i) => i.id === id)?.label,
          quantity: qty,
        }))

      if (items.length === 0) {
        setMessage('Selecciona al menos un producto con cantidad mayor a 0')
        setSaving(false)
        return
      }

      const { data } = await api.post(
        '/products/selection',
        { items },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage(data?.message || 'Inventario guardado correctamente')
      setQuantities({})
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Error al guardar el inventario')
    } finally {
      setSaving(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const selectedItems = Object.entries(quantities).filter(([_, qty]) => qty > 0)

  return (
    <div style={{ maxWidth: 720, margin: '20px auto', padding: 24, position: 'relative' }}>
      {/* Botón fijo arriba a la derecha */}
      <button
        onClick={logout}
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #d33',
          background: '#fff',
          color: '#d33',
          fontWeight: 600,
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        Cerrar sesión
      </button>

      <h2 style={{ marginTop: 0 }}>Selecciona tus productos</h2>
      <p style={{ color: '#666', marginTop: 0 }}>Ingresa la cantidad deseada para cada producto.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
        {ITEMS.map((item) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <span style={{ fontWeight: 500 }}>{item.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: '14px', color: '#666' }}>Cantidad:</label>
              <input
                type="number"
                min="0"
                max="999"
                value={quantities[item.id] || ''}
                onChange={(e) => updateQuantity(item.id, e.target.value)}
                placeholder="0"
                style={{
                  width: '60px',
                  padding: '4px 8px',
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  textAlign: 'center'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, borderTop: '1px solid #eee', paddingTop: 16 }}>
        <h3>Tu selección</h3>
        {selectedItems.length === 0 ? (
          <p style={{ color: '#999' }}>No has seleccionado productos aún.</p>
        ) : (
          <ul>
            {selectedItems.map(([id, qty]) => (
              <li key={id}>
                {ITEMS.find((i) => i.id === id)?.label} - Cantidad: {qty}
              </li>
            ))}
          </ul>
        )}

        <div style={{ marginTop: 12 }}>
          <button
            onClick={saveSelection}
            disabled={selectedItems.length === 0 || saving}
            style={{ 
              padding: '8px 12px', 
              borderRadius: 6, 
              border: 'none', 
              background: selectedItems.length === 0 ? '#ccc' : '#2f7cff', 
              color: '#fff', 
              fontWeight: 600,
              cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {saving ? 'Guardando...' : 'Guardar selección'}
          </button>
          {message && (
            <div style={{ marginTop: 10, color: message.includes('Error') ? '#d33' : '#2f7cff' }}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}