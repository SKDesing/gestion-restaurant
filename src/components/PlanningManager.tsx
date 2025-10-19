'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  AlertCircle,
  CheckCircle,
  Copy,
  Download
} from 'lucide-react'

interface Shift {
  id: string
  employeeId: string
  employeeName: string
  employeeRole: string
  date: string
  startTime: string
  endTime: string
  status: 'SCHEDULED' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'ABSENT'
  notes?: string
}

interface PlanningManagerProps {
  employees: any[]
  schedules: Shift[]
  onScheduleUpdate: (schedule: Shift) => void
  onScheduleCreate: (schedule: Omit<Shift, 'id'>) => void
  onScheduleDelete: (scheduleId: string) => void
}

const shiftTemplates = [
  { name: 'Service Midi', startTime: '11:30', endTime: '15:30', roles: ['WAITER', 'HOST', 'CASHIER'] },
  { name: 'Service Soir', startTime: '18:00', endTime: '23:00', roles: ['WAITER', 'HOST', 'CASHIER', 'BARTENDER'] },
  { name: 'Cuisine Midi', startTime: '10:00', endTime: '16:00', roles: ['CHEF', 'COOK', 'DISHWASHER'] },
  { name: 'Cuisine Soir', startTime: '17:00', endTime: '23:30', roles: ['CHEF', 'COOK', 'DISHWASHER'] },
  { name: 'Bar Continu', startTime: '12:00', endTime: '01:00', roles: ['BARTENDER'] },
  { name: 'Nettoyage', startTime: '22:00', endTime: '01:00', roles: ['DISHWASHER'] }
]

const statusColors = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CHECKED_IN: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  ABSENT: 'bg-red-100 text-red-800'
}

export function PlanningManager({ 
  employees, 
  schedules, 
  onScheduleUpdate, 
  onScheduleCreate, 
  onScheduleDelete 
}: PlanningManagerProps) {
  const [selectedWeek, setSelectedWeek] = useState(new Date().toISOString().split('T')[0])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newShift, setNewShift] = useState({
    employeeId: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  })

  const getWeekDates = (startDate: string) => {
    const dates = []
    const start = new Date(startDate)
    const dayOfWeek = start.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    start.setDate(start.getDate() + mondayOffset)
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  const weekDates = getWeekDates(selectedWeek)
  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

  const getSchedulesForDate = (date: string) => {
    return schedules.filter(s => s.date === date)
  }

  const getEmployeeAvailability = (employeeId: string, date: string) => {
    const employeeSchedules = schedules.filter(s => s.employeeId === employeeId && s.date === date)
    return {
      isAvailable: employeeSchedules.length === 0,
      schedules: employeeSchedules,
      totalHours: employeeSchedules.reduce((acc, s) => {
        const start = new Date(`2000-01-01T${s.startTime}`)
        const end = new Date(`2000-01-01T${s.endTime}`)
        return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      }, 0)
    }
  }

  const handleCreateShift = () => {
    if (newShift.employeeId && newShift.date && newShift.startTime && newShift.endTime) {
      const employee = employees.find(e => e.id === newShift.employeeId)
      onScheduleCreate({
        employeeId: newShift.employeeId,
        employeeName: employee?.name || '',
        employeeRole: employee?.role || '',
        date: newShift.date,
        startTime: newShift.startTime,
        endTime: newShift.endTime,
        status: 'SCHEDULED',
        notes: newShift.notes
      })
      setNewShift({ employeeId: '', date: '', startTime: '', endTime: '', notes: '' })
      setShowCreateForm(false)
    }
  }

  const handleApplyTemplate = () => {
    if (!selectedTemplate) return
    
    const template = shiftTemplates.find(t => t.name === selectedTemplate)
    if (!template) return

    const eligibleEmployees = employees.filter(e => template.roles.includes(e.role))
    
    weekDates.forEach(date => {
      eligibleEmployees.forEach(employee => {
        const availability = getEmployeeAvailability(employee.id, date)
        if (availability.isAvailable) {
          onScheduleCreate({
            employeeId: employee.id,
            employeeName: employee.name,
            employeeRole: employee.role,
            date,
            startTime: template.startTime,
            endTime: template.endTime,
            status: 'SCHEDULED',
            notes: `Créé via template: ${template.name}`
          })
        }
      })
    })
    
    setSelectedTemplate('')
  }

  const handleCopyWeek = () => {
    const nextWeek = new Date(selectedWeek)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextWeekDates = getWeekDates(nextWeek.toISOString().split('T')[0])

    weekDates.forEach((currentDate, index) => {
      const currentSchedules = getSchedulesForDate(currentDate)
      currentSchedules.forEach(schedule => {
        onScheduleCreate({
          employeeId: schedule.employeeId,
          employeeName: schedule.employeeName,
          employeeRole: schedule.employeeRole,
          date: nextWeekDates[index],
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          status: 'SCHEDULED',
          notes: `Copié du ${currentDate}`
        })
      })
    })
  }

  const getCoverageStats = (date: string) => {
    const daySchedules = getSchedulesForDate(date)
    const coverage = {
      morning: daySchedules.filter(s => {
        const hour = parseInt(s.startTime.split(':')[0])
        return hour >= 6 && hour < 14
      }).length,
      afternoon: daySchedules.filter(s => {
        const hour = parseInt(s.startTime.split(':')[0])
        return hour >= 14 && hour < 18
      }).length,
      evening: daySchedules.filter(s => {
        const hour = parseInt(s.startTime.split(':')[0])
        return hour >= 18 || hour < 2
      }).length
    }
    return coverage
  }

  return (
    <div className="space-y-4">
      {/* Contrôles du planning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Contrôles du planning
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopyWeek}>
                <Copy className="h-4 w-4 mr-2" />
                Copier semaine
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Semaine</label>
              <Input
                type="week"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Template rapide</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un template" />
                </SelectTrigger>
                <SelectContent>
                  {shiftTemplates.map(template => (
                    <SelectItem key={template.name} value={template.name}>
                      {template.name} ({template.startTime}-{template.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleApplyTemplate}
                disabled={!selectedTemplate}
                className="w-full"
              >
                Appliquer template
              </Button>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau service
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de création rapide */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Select value={newShift.employeeId} onValueChange={(value) => setNewShift(prev => ({ ...prev, employeeId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} ({employee.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newShift.date}
                onChange={(e) => setNewShift(prev => ({ ...prev, date: e.target.value }))}
              />
              <Input
                type="time"
                placeholder="Début"
                value={newShift.startTime}
                onChange={(e) => setNewShift(prev => ({ ...prev, startTime: e.target.value }))}
              />
              <Input
                type="time"
                placeholder="Fin"
                value={newShift.endTime}
                onChange={(e) => setNewShift(prev => ({ ...prev, endTime: e.target.value }))}
              />
              <div className="flex gap-2">
                <Button onClick={handleCreateShift} disabled={!newShift.employeeId || !newShift.date || !newShift.startTime || !newShift.endTime}>
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau de planning hebdomadaire */}
      <Card>
        <CardHeader>
          <CardTitle>Planning hebdomadaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-50 min-w-40">Employé / Jour</th>
                  {weekDates.map((date, index) => {
                    const coverage = getCoverageStats(date)
                    return (
                      <th key={date} className="border border-gray-300 p-2 bg-gray-50 min-w-36">
                        <div className="text-xs font-medium">
                          {weekDays[index]}
                        </div>
                        <div className="text-sm">
                          {new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </div>
                        <div className="flex justify-center gap-1 mt-1">
                          <div className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center text-xs">
                            {coverage.morning}
                          </div>
                          <div className="w-4 h-4 bg-green-200 rounded-full flex items-center justify-center text-xs">
                            {coverage.afternoon}
                          </div>
                          <div className="w-4 h-4 bg-orange-200 rounded-full flex items-center justify-center text-xs">
                            {coverage.evening}
                          </div>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="border border-gray-300 p-2">
                      <div className="font-medium text-sm">{employee.name}</div>
                      <div className="text-xs text-gray-600">{employee.role}</div>
                    </td>
                    {weekDates.map((date) => {
                      const daySchedules = getSchedulesForDate(date).filter(s => s.employeeId === employee.id)
                      const availability = getEmployeeAvailability(employee.id, date)
                      
                      return (
                        <td key={date} className="border border-gray-300 p-1">
                          {daySchedules.length > 0 ? (
                            <div className="space-y-1">
                              {daySchedules.map((schedule) => (
                                <div 
                                  key={schedule.id}
                                  className={`text-xs p-1 rounded text-center ${statusColors[schedule.status]}`}
                                >
                                  <div className="font-medium">
                                    {schedule.startTime} - {schedule.endTime}
                                  </div>
                                  {schedule.notes && (
                                    <div className="text-xs opacity-75 truncate" title={schedule.notes}>
                                      📝 {schedule.notes}
                                    </div>
                                  )}
                                </div>
                              ))}
                              <div className="text-xs text-gray-500 text-center">
                                {availability.totalHours.toFixed(1)}h
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setNewShift(prev => ({ 
                                  ...prev, 
                                  employeeId: employee.id, 
                                  date 
                                }))}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Légende */}
          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 rounded-full"></div>
              <span>Matin</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 rounded-full"></div>
              <span>Après-midi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-200 rounded-full"></div>
              <span>Soir</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}