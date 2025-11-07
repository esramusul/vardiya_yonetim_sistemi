import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API = {
  auth: '/api/v1/auth/login',
  departments: '/api/v1/departments',
  employees: '/api/v1/employees',
  shiftTemplates: '/api/v1/shift_templates',
  shifts: '/api/v1/shifts',
  shiftAssignments: (shiftId) => `/api/v1/shifts/${shiftId}/shift_assignments`,
}

const getToken = () => localStorage.getItem('authToken')
const setToken = (t) => localStorage.setItem('authToken', t)

async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const t = token || getToken()
  if (t) headers['Authorization'] = 'Bearer ' + t
  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let errText = ''
    try { errText = await res.text() } catch {}
    throw new Error('HTTP ' + res.status + ' ' + errText)
  }
  if (res.status === 204) return null
  return res.json()
}

function Section({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function useLoadLists(enabled) {
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const reload = async () => {
    if (!enabled) return
    setLoading(true); setError(null)
    try {
      const [deps, emps, temps] = await Promise.all([
        apiFetch(API.departments),
        apiFetch(API.employees),
        apiFetch(API.shiftTemplates),
      ])
      setDepartments(deps)
      setEmployees(emps)
      setTemplates(temps)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { reload() }, [enabled])
  return { departments, employees, templates, loading, error, reload }
}

export default function App() {
  useEffect(() => { document.title = 'Vardiya Yönetim Sistemi' }, [])

  const [token, setTokenState] = useState(getToken())
  const [currentUser, setCurrentUser] = useState(null)
  const [status, setStatus] = useState('')
  const authed = !!token
  const { departments, employees, templates, loading, error, reload } = useLoadLists(authed)

  // Login state
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('123456')
  const onLogin = async (e) => {
    e.preventDefault(); setStatus('Giriş yapılıyor...')
    try {
      const data = await apiFetch(API.auth, { method: 'POST', body: { email, password }, token: null })
      setToken(data.token); setTokenState(data.token); setCurrentUser(data.user || null)
      setStatus('Giriş başarılı'); reload()
    } catch (e) { setStatus('Hata: ' + e.message) }
  }

  // Department
  const [depName, setDepName] = useState('')
  const createDepartment = async () => {
    if (!depName.trim()) return
    setStatus('Departman oluşturuluyor...')
    try {
      await apiFetch(API.departments, { method: 'POST', body: { department: { name: depName.trim() } } })
      setDepName(''); await reload(); setStatus('Departman eklendi')
    } catch (e) { setStatus('Hata: ' + e.message) }
  }

  // Employee
  const [empName, setEmpName] = useState('')
  const [empDepId, setEmpDepId] = useState('')
  const createEmployee = async () => {
    if (!empName.trim() || !empDepId) return
    setStatus('Çalışan oluşturuluyor...')
    try {
      const payload = { employee: { full_name: empName.trim(), department_id: Number(empDepId) } }
      if (currentUser?.id) payload.employee.user_id = Number(currentUser.id)
      await apiFetch(API.employees, { method: 'POST', body: payload })
      setEmpName(''); await reload(); setStatus('Çalışan eklendi')
    } catch (e) { setStatus('Hata: ' + e.message) }
  }

  // Shift template
  const [stName, setStName] = useState('')
  const [stStart, setStStart] = useState('08:00')
  const [stEnd, setStEnd] = useState('16:00')
  const createTemplate = async () => {
    if (!stName.trim() || !stStart || !stEnd) return
    setStatus('Şablon oluşturuluyor...')
    try {
      await apiFetch(API.shiftTemplates, { method: 'POST', body: { shift_template: { name: stName.trim(), start_time: stStart, end_time: stEnd } } })
      setStName(''); await reload(); setStatus('Şablon eklendi')
    } catch (e) { setStatus('Hata: ' + e.message) }
  }

  // Assignment
  const [assEmpId, setAssEmpId] = useState('')
  const [assTemplateId, setAssTemplateId] = useState('')
  const [assDate, setAssDate] = useState('')
  const [assignments, setAssignments] = useState([])
  const ensureShiftAndAssign = async () => {
    if (!assEmpId || !assTemplateId || !assDate) return
    const employee = employees.find((e) => String(e.id) === String(assEmpId))
    if (!employee) { setStatus('Hata: çalışan bulunamadı'); return }
    const departmentId = employee.department_id || employee.department?.id
    if (!departmentId) { setStatus('Hata: çalışan departmanı yok'); return }
    setStatus('Vardiya atanıyor...')
    try {
      const dayShifts = await apiFetch(API.shifts + '?date=' + encodeURIComponent(assDate))
      let shift = dayShifts.find((s) => String(s.department_id) === String(departmentId) && String(s.shift_template_id) === String(assTemplateId))
      if (!shift) {
        shift = await apiFetch(API.shifts, { method: 'POST', body: { shift: { work_date: assDate, department_id: Number(departmentId), shift_template_id: Number(assTemplateId) } } })
      }
      await apiFetch(API.shiftAssignments(shift.id), { method: 'POST', body: { shift_assignment: { employee_id: Number(assEmpId) } } })
      const tmpl = templates.find((t) => String(t.id) === String(assTemplateId))
      setAssignments((prev) => [{ id: Date.now(), date: assDate, employeeName: employee.full_name, templateName: tmpl ? tmpl.name : ('Şablon #' + assTemplateId) }, ...prev])
      setStatus('Atama eklendi')
    } catch (e) { setStatus('Hata: ' + e.message) }
  }

  const logout = () => { localStorage.removeItem('authToken'); setTokenState(null) }

  return (
    <>
      <header className="app-header">
        <h1>Vardiya Yönetim Sistemi</h1>
      </header>
      <div className="container grid">
        {!authed ? (
          <Section title="Giriş">
            <form onSubmit={onLogin} className="row" style={{ alignItems: 'end' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label>E-posta</label>
                <input data-test="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label>Şifre</label>
                <input data-test="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required />
              </div>
              <div>
                <button data-test="login-submit" type="submit">Giriş Yap</button>
              </div>
              <div className="mini muted">{status}</div>
            </form>
          </Section>
        ) : (
          <Section title="Oturum">
            <div className="row">
              <span className="tag">Token kaydedildi</span>
              <span className="status ok">Giriş yapıldı</span>
              <div style={{ flex: 1 }} />
              <button onClick={logout}>Çıkış</button>
            </div>
            <div className="mini muted" style={{ marginTop: 8 }}>{status || (loading ? 'Yükleniyor...' : (error ? ('Hata: ' + error) : 'Hazır'))}</div>
          </Section>
        )}

        {authed && (
          <>
            <Section title="Departmanlar">
              <div className="row">
                <input data-test="department-name" type="text" placeholder="Departman adı" value={depName} onChange={(e) => setDepName(e.target.value)} />
                <button data-test="department-submit" type="button" onClick={createDepartment}>Ekle</button>
              </div>
              <ul data-test="department-list">
                {departments.map((d) => (<li key={d.id}>{d.name}</li>))}
              </ul>
            </Section>

            <Section title="Çalışanlar">
              <div className="row">
                <select data-test="employee-department" value={empDepId} onChange={(e) => setEmpDepId(e.target.value)}>
                  <option value="">Departman seçin</option>
                  {departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                </select>
                <input data-test="employee-name" type="text" placeholder="Ad Soyad" value={empName} onChange={(e) => setEmpName(e.target.value)} />
                <button data-test="employee-submit" type="button" onClick={createEmployee}>Ekle</button>
              </div>
              <ul data-test="employee-list">
                {employees.map((e) => (
                  <li key={e.id}>{e.full_name} <span className="mini muted">{e.department?.name ? `(${e.department.name})` : ''}</span></li>
                ))}
              </ul>
            </Section>

            <Section title="Vardiya Şablonları">
              <div className="row">
                <input data-test="shift-template-name" type="text" placeholder="Şablon adı" value={stName} onChange={(e) => setStName(e.target.value)} />
                <input data-test="shift-template-start" type="time" value={stStart} onChange={(e) => setStStart(e.target.value)} />
                <input data-test="shift-template-end" type="time" value={stEnd} onChange={(e) => setStEnd(e.target.value)} />
                <button data-test="shift-template-submit" type="button" onClick={createTemplate}>Ekle</button>
              </div>
              <ul data-test="shift-template-list">
                {templates.map((t) => (
                  <li key={t.id}>{t.name} <span className="mini muted">({t.start_time} - {t.end_time})</span></li>
                ))}
              </ul>
            </Section>

            <Section title="Vardiya Atamaları">
              <div className="row">
                <select data-test="assignment-employee" value={assEmpId} onChange={(e) => setAssEmpId(e.target.value)}>
                  <option value="">Çalışan seçin</option>
                  {employees.map((e) => (<option value={e.id} key={e.id}>{e.full_name}</option>))}
                </select>
                <select data-test="assignment-shift-template" value={assTemplateId} onChange={(e) => setAssTemplateId(e.target.value)}>
                  <option value="">Şablon seçin</option>
                  {templates.map((t) => (<option value={t.id} key={t.id}>{t.name}</option>))}
                </select>
                <input data-test="assignment-date" type="date" value={assDate} onChange={(e) => setAssDate(e.target.value)} />
                <button data-test="assignment-submit" type="button" onClick={ensureShiftAndAssign}>Ata</button>
              </div>
              <ul data-test="assignment-list">
                {assignments.map((a) => (
                  <li key={a.id}>{a.employeeName} - {a.date} - {a.templateName}</li>
                ))}
              </ul>
            </Section>
          </>
        )}
      </div>
    </>
  )
}
