'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  Calendar, 
  Clock, 
  UserPlus, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Coffee,
  ChefHat,
  Beer,
  Smartphone
} from 'lucide-react'

// Mock data pour les employés
const mockEmployees = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@restaurant.fr',
    phone: '06 12 34 56 78',
    role: 'WAITER',
    salary: 1800,
    hireDate: '2023-01-15',
    status: 'ACTIVE',
    totalShifts: 45,
    completedShifts: 42,
    attendance: 93.3
  },
  {
    id: '2',
    name: 'Jean Martin',
    email: 'jean.martin@restaurant.fr',
    phone: '06 23 45 67 89',
    role: 'CHEF',
    salary: 2800,
    hireDate: '2022-06-01',
    status: 'ACTIVE',
    totalShifts: 48,
    completedShifts: 48,
    attendance: 100
  },
  {
    id: '3',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@restaurant.fr',
    phone: '06 34 56 78 90',
    role: 'BARTENDER',
    salary: 2000,
    hireDate: '2023-03-10',
    status: 'ACTIVE',
    totalShifts: 40,
    completedShifts: 38,
    attendance: 95
  },
  {
    id: '4',
    name: 'Pierre Durand',
    email: 'pierre.durand@restaurant.fr',
    phone: '06 45 67 89 01',
    role: 'COOK',
    salary: 2200,
    hireDate: '2023-07-20',
    status: 'ON_LEAVE',
    totalShifts: 35,
    completedShifts: 33,
    attendance: 94.3
  }
]

// Mock data pour les plannings de la semaine
const mockSchedules = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Marie Dubois',
    employeeRole: 'WAITER',
    date: '2024-01-15',
    startTime: '11:30',
    endTime: '15:30',
    status: 'SCHEDULED'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Jean Martin',
    employeeRole: 'CHEF',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '18:00',
    status: 'CHECKED_IN',
    actualStartTime: '09:58'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Sophie Bernard',
    employeeRole: 'BARTENDER',
    date: '2024-01-15',
    startTime: '18:00',
    endTime: '23:00',
    status: 'SCHEDULED'
  }
]

const roleConfig = {
  OWNER: { name: 'Gérant', icon: <Users className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
  MANAGER: { name: 'Manager', icon: <TrendingUp className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
  WAITER: { name: 'Serveur', icon: <Coffee className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
  BARTENDER: { name: 'Barman', icon: <Beer className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
  CHEF: { name: 'Chef', icon: <ChefHat className="h-4 w-4" />, color: 'bg-red-100 text-red-800' },
  COOK: { name: 'Cuisinier', icon: <ChefHat className="h-4 w-4" />, color: 'bg-red-100 text-red-800' },
  DISHWASHER: { name: 'Plongeur', icon: <Users className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800' },
  HOST: { name: 'Hôte/Hôtesse', icon: <Users className="h-4 w-4" />, color: 'bg-pink-100 text-pink-800' },
  CASHIER: { name: 'Caissier', icon: <Smartphone className="h-4 w-4" />, color: 'bg-indigo-100 text-indigo-800' }
}

const statusConfig = {
  ACTIVE: { name: 'Actif', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
  INACTIVE: { name: 'Inactif', color: 'bg-gray-100 text-gray-800', icon: <XCircle className="h-4 w-4" /> },
  ON_LEAVE: { name: 'Congé', color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle className="h-4 w-4" /> },
  TERMINATED: { name: 'Terminé', color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> }
}

const scheduleStatusConfig = {
  SCHEDULED: { name: 'Planifié', color: 'bg-blue-100 text-blue-800' },
  CHECKED_IN: { name: 'Présent', color: 'bg-green-100 text-green-800' },
  CHECKED_OUT: { name: 'Parti', color: 'bg-gray-100 text-gray-800' },
  ABSENT: { name: 'Absent', color: 'bg-red-100 text-red-800' },
  LATE: { name: 'En retard', color: 'bg-orange-100 text-orange-800' }
}

export default function PersonnelManagement() {
  const [employees, setEmployees] = useState(mockEmployees)
  const [schedules, setSchedules] = useState(mockSchedules)
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    salary: '',
    hireDate: '',
    address: '',
    birthDate: '',
    notes: ''
  })
  const [selectedWeek, setSelectedWeek] = useState(new Date().toISOString().split('T')[0])

  const totalStats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'ACTIVE').length,
    onLeaveEmployees: employees.filter(e => e.status === 'ON_LEAVE').length,
    avgAttendance: employees.length > 0 
      ? (employees.reduce((acc, e) => acc + e.attendance, 0) / employees.length).toFixed(1)
      : 0
  }

  const handleCreateEmployee = () => {
    const employee = {
      id: Date.now().toString(),
      ...newEmployee,
      salary: parseFloat(newEmployee.salary),
      status: 'ACTIVE',
      totalShifts: 0,
      completedShifts: 0,
      attendance: 100
    }
    setEmployees(prev => [employee, ...prev])
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      role: '',
      salary: '',
      hireDate: '',
      address: '',
      birthDate: '',
      notes: ''
    })
  }

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(e => e.id !== employeeId))
    setSchedules(prev => prev.filter(s => s.employeeId !== employeeId))
  }

  const handleCheckIn = (scheduleId: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, status: 'CHECKED_IN', actualStartTime: new Date().toTimeString().slice(0, 5) }
        : schedule
    ))
  }

  const handleCheckOut = (scheduleId: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, status: 'CHECKED_OUT', actualEndTime: new Date().toTimeString().slice(0, 5) }
        : schedule
    ))
  }

  const getWeekDates = (startDate: string) => {
    const dates: string[] = []
    const start = new Date(startDate)
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  const weekDates = getWeekDates(selectedWeek)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Gestion du Personnel</h1>
                <p className="text-sm text-gray-600">Plannings et pointage des employés</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="week"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="w-48"
              />
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total employés</p>
                  <p className="text-xl font-bold">{totalStats.totalEmployees}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Employés actifs</p>
                  <p className="text-xl font-bold">{totalStats.activeEmployees}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En congé</p>
                  <p className="text-xl font-bold">{totalStats.onLeaveEmployees}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux présence</p>
                  <p className="text-xl font-bold">{totalStats.avgAttendance}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="employees">Employés</TabsTrigger>
            <TabsTrigger value="schedule">Planning</TabsTrigger>
            <TabsTrigger value="attendance">Pointage</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Ajouter un employé */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Nouvel employé
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Nom complet"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <Input
                    placeholder="Téléphone"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {config.icon}
                            {config.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Salaire mensuel"
                    value={newEmployee.salary}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, salary: e.target.value }))}
                  />
                  <Input
                    type="date"
                    value={newEmployee.hireDate}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, hireDate: e.target.value }))}
                  />
                  <Button 
                    onClick={handleCreateEmployee}
                    className="w-full"
                    disabled={!newEmployee.name || !newEmployee.role}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter l'employé
                  </Button>
                </CardContent>
              </Card>

              {/* Liste des employés */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Liste des employés ({employees.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {employees.map((employee) => (
                        <div key={employee.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{employee.name}</h3>
                                <Badge variant="outline" className={roleConfig[employee.role as keyof typeof roleConfig]?.color}>
                                  <div className="flex items-center gap-1">
                                    {roleConfig[employee.role as keyof typeof roleConfig]?.icon}
                                    {roleConfig[employee.role as keyof typeof roleConfig]?.name}
                                  </div>
                                </Badge>
                                <Badge variant="outline" className={statusConfig[employee.status as keyof typeof statusConfig]?.color}>
                                  <div className="flex items-center gap-1">
                                    {statusConfig[employee.status as keyof typeof statusConfig]?.icon}
                                    {statusConfig[employee.status as keyof typeof statusConfig]?.name}
                                  </div>
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                                <div>📧 {employee.email}</div>
                                <div>📱 {employee.phone}</div>
                                <div>💰 €{employee.salary}/mois</div>
                                <div>📅 {new Date(employee.hireDate).toLocaleDateString('fr-FR')}</div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-600">
                                  Services: {employee.completedShifts}/{employee.totalShifts}
                                </span>
                                <span className={`font-medium ${employee.attendance >= 95 ? 'text-green-600' : employee.attendance >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                                  Présence: {employee.attendance}%
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeleteEmployee(employee.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Planning hebdomadaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 p-2 bg-gray-50">Employé</th>
                        {weekDates.map((date, index) => (
                          <th key={date} className="border border-gray-300 p-2 bg-gray-50 min-w-32">
                            <div className="text-xs">
                              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index]}
                            </div>
                            <div className="font-semibold">
                              {new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee.id}>
                          <td className="border border-gray-300 p-2">
                            <div className="font-medium text-sm">{employee.name}</div>
                            <div className="text-xs text-gray-600">
                              {roleConfig[employee.role as keyof typeof roleConfig]?.name}
                            </div>
                          </td>
                          {weekDates.map((date) => {
                            const daySchedules = schedules.filter(s => 
                              s.employeeId === employee.id && s.date === date
                            )
                            return (
                              <td key={date} className="border border-gray-300 p-2">
                                {daySchedules.length > 0 ? (
                                  <div className="space-y-1">
                                    {daySchedules.map((schedule) => (
                                      <div 
                                        key={schedule.id} 
                                        className={`text-xs p-1 rounded text-center ${scheduleStatusConfig[schedule.status as keyof typeof scheduleStatusConfig]?.color}`}
                                      >
                                        <div className="font-medium">
                                          {schedule.startTime} - {schedule.endTime}
                                        </div>
                                        {schedule.status === 'CHECKED_IN' && (
                                          <div className="text-xs">
                                            Arrivé: {schedule.actualStartTime}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center text-gray-400 text-xs">-</div>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Pointage du jour */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pointage du jour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {schedules
                      .filter(s => s.date === new Date().toISOString().split('T')[0])
                      .map((schedule) => (
                        <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{schedule.employeeName}</div>
                            <div className="text-sm text-gray-600">
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                            <div className="text-xs text-gray-500">
                              {roleConfig[schedule.employeeRole as keyof typeof roleConfig]?.name}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {schedule.status === 'SCHEDULED' && (
                              <Button
                                size="sm"
                                onClick={() => handleCheckIn(schedule.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Arrivée
                              </Button>
                            )}
                            {schedule.status === 'CHECKED_IN' && (
                              <Button
                                size="sm"
                                onClick={() => handleCheckOut(schedule.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Départ
                              </Button>
                            )}
                            <Badge variant="outline" className={scheduleStatusConfig[schedule.status as keyof typeof scheduleStatusConfig]?.color}>
                              {scheduleStatusConfig[schedule.status as keyof typeof scheduleStatusConfig]?.name}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques de présence */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Statistiques de présence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employees.map((employee) => (
                      <div key={employee.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{employee.name}</div>
                          <div className="text-xs text-gray-600">
                            {employee.completedShifts}/{employee.totalShifts} services
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                employee.attendance >= 95 ? 'bg-green-600' : 
                                employee.attendance >= 90 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${employee.attendance}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${
                            employee.attendance >= 95 ? 'text-green-600' : 
                            employee.attendance >= 90 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {employee.attendance}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}