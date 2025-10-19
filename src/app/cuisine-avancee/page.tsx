'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChefHat, 
  Fire,
  Timer,
  Bell,
  Utensils,
  Coffee,
  Users,
  TrendingUp,
  Eye,
  Printer,
  AlertTriangle,
  CheckSquare,
  Square,
  Play,
  Pause,
  Thermometer,
  Droplets,
  Wrench,
  Clipboard,
  Calendar,
  Package,
  RefreshCw,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Settings,
  BarChart3,
  Activity,
  Zap,
  Target,
  Award,
  Star,
  TrendingDown,
  AlertOctagon,
  Shield,
  // Settings (déjà importé),
  SprayCan,
  Refrigerator,
  // Refrigerator (déjà importé),
  Microwave,
  Flame,
  FileText,
  CheckCircle2,
  XCircle,
  ThermometerSun,
  Snowflake,
  Clock4,
  CalendarCheck,
  ClipboardCheck,
  FileCheck,
  TrendingUp,
  BarChart,
  PieChart,
  LineChart,

  Medal,
  Heart,
  Brain,
  Lightbulb,
  Settings2,
  // FilterCircle,
  SearchCode,
  RefreshCcwDot,
  PlayCircle,
  PauseCircle,
  StopCircle
} from 'lucide-react'

interface KitchenOrder {
  id: string
  orderNumber: string
  tableNumber?: string
  customerName?: string
  orderType: 'DINE_IN' | 'TAKEOUT' | 'DELIVERY' | 'BAR'
  items: KitchenOrderItem[]
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  orderTime: string
  estimatedTime?: number
  actualTime?: number
  pickupTime?: string
  notes?: string
  serverName?: string
  stationId?: string
  stationName?: string
}

interface KitchenOrderItem {
  id: string
  name: string
  quantity: number
  category: string
  instructions?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'READY' | 'COMPLETED' | 'CANCELLED'
  startedAt?: string
  completedAt?: string
  estimatedTime?: number
  stationId?: string
  stationName?: string
}

interface KitchenStation {
  id: string
  name: string
  type: string
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'CLEANING'
  capacity: number
  currentOrders: number
  efficiency: number
}

interface CleaningTask {
  id: string
  title: string
  description: string
  type: string
  frequency: string
  stationId?: string
  stationName?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  estimatedDuration: number
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED'
  assignedTo?: string
  nextDue: string
  lastCompleted?: string
}

interface QualityControl {
  id: string
  type: string
  stationId?: string
  stationName?: string
  temperature?: number
  pH?: number
  visual?: boolean
  status: 'PASS' | 'FAIL' | 'CRITICAL' | 'CORRECTIVE'
  checkedBy: string
  checkedAt: string
  notes?: string
  correctiveAction?: string
  nextCheck?: string
  frequency?: string
}

interface HACCPRecord {
  id: string
  category: string
  item: string
  temperature: number
  time: string
  employee: string
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'CRITICAL'
  action?: string
}

interface CleaningSchedule {
  id: string
  taskName: string
  frequency: string
  lastCompleted: string
  nextDue: string
  assignedTo: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  estimatedTime: number
  actualTime?: number
  verificationRequired: boolean
  verifiedBy?: string
  verifiedAt?: string
}

interface KitchenInventory {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  minQuantity: number
  status: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED' | 'EXPIRING_SOON'
  expiryDate?: string
  location?: string
}

export default function CuisineAvancee() {
  const [activeTab, setActiveTab] = useState('commandes')
  const [orders, setOrders] = useState<KitchenOrder[]>([])
  const [stations, setStations] = useState<KitchenStation[]>([])
  const [cleaningTasks, setCleaningTasks] = useState<CleaningTask[]>([])
  const [qualityControls, setQualityControls] = useState<QualityControl[]>([])
  const [inventory, setInventory] = useState<KitchenInventory[]>([])
  const [selectedStation, setSelectedStation] = useState<string>('all')
  const [haccpRecords, setHaccpRecords] = useState<HACCPRecord[]>([])
  const [cleaningSchedule, setCleaningSchedule] = useState<CleaningSchedule[]>([])
  const [showAlerts, setShowAlerts] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showTempModal, setShowTempModal] = useState(false)
  const [selectedTempStation, setSelectedTempStation] = useState<string>('')

  // Données initiales simulées
  const [initialData] = useState({
    orders: [
      {
        id: '1',
        orderNumber: 'CMD-001',
        tableNumber: 'T2',
        orderType: 'DINE_IN' as const,
        status: 'PREPARING' as const,
        priority: 'HIGH' as const,
        orderTime: '2024-01-15T12:30:00Z',
        estimatedTime: 25,
        actualTime: 15,
        notes: 'Client allergique aux noix',
        serverName: 'Marie',
        stationId: '1',
        stationName: 'Plats chauds',
        items: [
          {
            id: '1',
            name: 'Steak Frites',
            quantity: 1,
            category: 'Plat',
            instructions: 'Saignant, sauce séparée',
            status: 'IN_PROGRESS' as const,
            startedAt: '2024-01-15T12:32:00Z',
            estimatedTime: 20,
            stationId: '1',
            stationName: 'Plats chauds'
          },
          {
            id: '2',
            name: 'Salade César',
            quantity: 1,
            category: 'Entrée',
            instructions: 'Sans croûtons, extra parmesan',
            status: 'READY' as const,
            startedAt: '2024-01-15T12:31:00Z',
            completedAt: '2024-01-15T12:40:00Z',
            estimatedTime: 10,
            stationId: '2',
            stationName: 'Froid'
          }
        ]
      },
      {
        id: '2',
        orderNumber: 'EM-002',
        customerName: 'Jean Dupont',
        orderType: 'TAKEOUT' as const,
        status: 'PENDING' as const,
        priority: 'NORMAL' as const,
        orderTime: '2024-01-15T12:35:00Z',
        estimatedTime: 20,
        pickupTime: '2024-01-15T13:00:00Z',
        stationId: '3',
        stationName: 'Emporter',
        items: [
          {
            id: '3',
            name: 'Burger Classic',
            quantity: 2,
            category: 'Plat',
            instructions: 'Sans cornichons',
            status: 'PENDING' as const,
            estimatedTime: 15,
            stationId: '1',
            stationName: 'Plats chauds'
          },
          {
            id: '4',
            name: 'Frites',
            quantity: 2,
            category: 'Accompagnement',
            instructions: 'Bien cuites',
            status: 'PENDING' as const,
            estimatedTime: 10,
            stationId: '4',
            stationName: 'Friture'
          }
        ]
      },
      {
        id: '3',
        orderNumber: 'BAR-003',
        orderType: 'BAR' as const,
        status: 'READY' as const,
        priority: 'LOW' as const,
        orderTime: '2024-01-15T12:15:00Z',
        estimatedTime: 5,
        actualTime: 3,
        stationId: '5',
        stationName: 'Bar',
        items: [
          {
            id: '5',
            name: 'Cocktail Mojito',
            quantity: 1,
            category: 'Boisson',
            instructions: 'Extra menthe',
            status: 'READY' as const,
            startedAt: '2024-01-15T12:16:00Z',
            completedAt: '2024-01-15T12:19:00Z',
            estimatedTime: 5,
            stationId: '5',
            stationName: 'Bar'
          }
        ]
      }
    ] as KitchenOrder[],
    stations: [
      {
        id: '1',
        name: 'Plats chauds',
        type: 'MAIN_COURSE',
        status: 'ACTIVE',
        capacity: 3,
        currentOrders: 2,
        efficiency: 85
      },
      {
        id: '2',
        name: 'Froid',
        type: 'COLD_STARTER',
        status: 'ACTIVE',
        capacity: 2,
        currentOrders: 1,
        efficiency: 92
      },
      {
        id: '3',
        name: 'Emporter',
        type: 'PREPARATION',
        status: 'ACTIVE',
        capacity: 2,
        currentOrders: 1,
        efficiency: 78
      },
      {
        id: '4',
        name: 'Friture',
        type: 'FRYER',
        status: 'ACTIVE',
        capacity: 2,
        currentOrders: 0,
        efficiency: 88
      },
      {
        id: '5',
        name: 'Bar',
        type: 'BAR',
        status: 'ACTIVE',
        capacity: 1,
        currentOrders: 0,
        efficiency: 95
      }
    ] as KitchenStation[],
    cleaningTasks: [
      {
        id: '1',
        title: 'Nettoyage plan de travail',
        description: 'Désinfection complète des plans de travail',
        type: 'DAILY_CLEANING',
        frequency: 'DAILY',
        stationId: '1',
        stationName: 'Plats chauds',
        priority: 'HIGH',
        estimatedDuration: 15,
        status: 'PENDING',
        nextDue: '2024-01-15T14:00:00Z'
      },
      {
        id: '2',
        title: 'Contrôle température frigo',
        description: 'Vérification et enregistrement température',
        type: 'FRIDGE_CLEANING',
        frequency: 'HOURLY',
        stationId: '2',
        stationName: 'Froid',
        priority: 'CRITICAL',
        estimatedDuration: 5,
        status: 'COMPLETED',
        nextDue: '2024-01-15T13:00:00Z',
        lastCompleted: '2024-01-15T12:00:00Z'
      },
      {
        id: '3',
        title: 'Nettoyage friteuse',
        description: 'Vidange et nettoyage complet',
        type: 'DEEP_CLEANING',
        frequency: 'WEEKLY',
        stationId: '4',
        stationName: 'Friture',
        priority: 'MEDIUM',
        estimatedDuration: 45,
        status: 'OVERDUE',
        nextDue: '2024-01-14T20:00:00Z'
      }
    ] as CleaningTask[],
    qualityControls: [
      {
        id: '1',
        type: 'FRIDGE_TEMPERATURE',
        stationId: '2',
        stationName: 'Froid',
        temperature: 3.5,
        status: 'PASS',
        checkedBy: 'Chef Pierre',
        checkedAt: '2024-01-15T12:00:00Z',
        notes: 'Température normale'
      },
      {
        id: '2',
        type: 'FOOD_TEMPERATURE',
        stationId: '1',
        stationName: 'Plats chauds',
        temperature: 72,
        status: 'PASS',
        checkedBy: 'Chef Marie',
        checkedAt: '2024-01-15T11:30:00Z',
        notes: 'Chauffage conforme'
      }
    ] as QualityControl[],
    inventory: [
      {
        id: '1',
        name: 'Steak de bœuf',
        category: 'Viande',
        quantity: 15,
        unit: 'pièces',
        minQuantity: 10,
        status: 'AVAILABLE',
        expiryDate: '2024-01-20T00:00:00Z',
        location: 'Frigo 1'
      },
      {
        id: '2',
        name: 'Salade verte',
        category: 'Légumes',
        quantity: 3,
        unit: 'kg',
        minQuantity: 5,
        status: 'LOW_STOCK',
        expiryDate: '2024-01-17T00:00:00Z',
        location: 'Frigo 2'
      },
      {
        id: '3',
        name: 'Huile de friture',
        category: 'Produits',
        quantity: 25,
        unit: 'L',
        minQuantity: 20,
        status: 'AVAILABLE',
        location: 'Réserve'
      }
    ] as KitchenInventory[],
    haccpRecords: [
      {
        id: '1',
        category: 'Réfrigération',
        item: 'Frigo 1 - Viandes',
        temperature: 3.5,
        time: '2024-01-15T12:00:00Z',
        employee: 'Chef Pierre',
        status: 'COMPLIANT',
        action: 'Température normale'
      },
      {
        id: '2',
        category: 'Cuisson',
        item: 'Four principal',
        temperature: 180,
        time: '2024-01-15T11:30:00Z',
        employee: 'Chef Marie',
        status: 'COMPLIANT',
        action: 'Cuisson conforme'
      },
      {
        id: '3',
        category: 'Réfrigération',
        item: 'Frigo 2 - Légumes',
        temperature: 6.5,
        time: '2024-01-15T12:00:00Z',
        employee: 'Chef Pierre',
        status: 'NON_COMPLIANT',
        action: 'Température trop élevée - Ajustement nécessaire'
      }
    ] as HACCPRecord[],
    cleaningSchedule: [
      {
        id: '1',
        taskName: 'Désinfection plans de travail',
        frequency: 'Chaque 2 heures',
        lastCompleted: '2024-01-15T12:00:00Z',
        nextDue: '2024-01-15T14:00:00Z',
        assignedTo: 'Équipe A',
        status: 'SCHEDULED',
        priority: 'HIGH',
        estimatedTime: 15,
        verificationRequired: true,
        verifiedBy: 'Chef Pierre',
        verifiedAt: '2024-01-15T12:15:00Z'
      },
      {
        id: '2',
        taskName: 'Nettoyage friteuse',
        frequency: 'Hebdomadaire',
        lastCompleted: '2024-01-08T20:00:00Z',
        nextDue: '2024-01-15T20:00:00Z',
        assignedTo: 'Équipe B',
        status: 'OVERDUE',
        priority: 'CRITICAL',
        estimatedTime: 45,
        verificationRequired: true
      },
      {
        id: '3',
        taskName: 'Contrôle température',
        frequency: 'Horaire',
        lastCompleted: '2024-01-15T12:00:00Z',
        nextDue: '2024-01-15T13:00:00Z',
        assignedTo: 'Tous',
        status: 'SCHEDULED',
        priority: 'CRITICAL',
        estimatedTime: 5,
        verificationRequired: true
      }
    ] as CleaningSchedule[]
  })

  useEffect(() => {
    setOrders(initialData.orders)
    setStations(initialData.stations)
    setCleaningTasks(initialData.cleaningTasks)
    setQualityControls(initialData.qualityControls)
    setInventory(initialData.inventory)
    setHaccpRecords(initialData.haccpRecords)
    setCleaningSchedule(initialData.cleaningSchedule)
  }, [initialData])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'NORMAL': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'MEDIUM': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      case 'CRITICAL': return 'bg-red-200 text-red-900 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'PREPARING':
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'READY': return 'bg-green-100 text-green-800'
      case 'SERVED':
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'OVERDUE': return 'bg-red-200 text-red-900'
      case 'PASS': return 'bg-green-100 text-green-800'
      case 'FAIL': return 'bg-red-100 text-red-800'
      case 'CRITICAL': return 'bg-red-200 text-red-900'
      case 'CORRECTIVE': return 'bg-orange-100 text-orange-800'
      case 'LOW_STOCK': return 'bg-yellow-100 text-yellow-800'
      case 'OUT_OF_STOCK': return 'bg-red-100 text-red-800'
      case 'EXPIRED': return 'bg-red-200 text-red-900'
      case 'EXPIRING_SOON': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'DINE_IN': return <Utensils className="h-4 w-4" />
      case 'TAKEOUT': return <Package className="h-4 w-4" />
      case 'DELIVERY': return <Users className="h-4 w-4" />
      case 'BAR': return <Coffee className="h-4 w-4" />
      default: return <Utensils className="h-4 w-4" />
    }
  }

  const getStationIcon = (type: string) => {
    switch (type) {
      case 'MAIN_COURSE': return <Flame className="h-4 w-4" />
      case 'COLD_STARTER': return <Thermometer className="h-4 w-4" />
      case 'FRYER': return <Droplets className="h-4 w-4" />
      case 'BAR': return <Coffee className="h-4 w-4" />
      default: return <ChefHat className="h-4 w-4" />
    }
  }

  const getCleaningIcon = (type: string) => {
    switch (type) {
  case 'DAILY_CLEANING': return <Settings className="h-4 w-4" />
  case 'DEEP_CLEANING': return <SprayCan className="h-4 w-4" />
  case 'DISHWASHING': return <Refrigerator className="h-4 w-4" />
  case 'FRIDGE_CLEANING': return <Refrigerator className="h-4 w-4" />
  default: return <Settings className="h-4 w-4" />
    }
  }

  const getActiveOrders = () => orders.filter(o => !['COMPLETED', 'CANCELLED'].includes(o.status))
  const getOrdersByStation = (stationId: string) => {
    if (stationId === 'all') return getActiveOrders()
    return getActiveOrders().filter(o => o.stationId === stationId)
  }

  const getHACCPStatus = () => {
    const compliant = haccpRecords.filter(r => r.status === 'COMPLIANT').length
    const total = haccpRecords.length
    return total > 0 ? Math.round((compliant / total) * 100) : 100
  }

  const getCriticalAlerts = () => {
    return haccpRecords.filter(r => r.status === 'CRITICAL' || r.status === 'NON_COMPLIANT')
  }

  const getOverdueTasks = () => {
    return cleaningSchedule.filter(task => 
      task.status === 'OVERDUE' || 
      new Date(task.nextDue) < new Date()
    )
  }

  const addTemperatureControl = (stationId: string, temperature: number, employee: string) => {
    const newRecord: HACCPRecord = {
      id: Date.now().toString(),
      category: 'Contrôle température',
      item: stations.find(s => s.id === stationId)?.name || 'Station',
      temperature,
      time: new Date().toISOString(),
      employee,
      status: temperature >= 0 && temperature <= 4 ? 'COMPLIANT' : temperature > 4 && temperature <= 8 ? 'NON_COMPLIANT' : 'CRITICAL',
      action: temperature > 4 ? 'Température trop élevée - Action corrective requise' : 'Température normale'
    }
    setHaccpRecords([newRecord, ...haccpRecords])
  }

  const completeCleaningTask = (taskId: string) => {
    setCleaningSchedule(cleaningSchedule.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: 'COMPLETED', 
            lastCompleted: new Date().toISOString(),
            nextDue: new Date(Date.now() + getTaskFrequency(task.frequency) * 60 * 60 * 1000).toISOString()
          }
        : task
    ))
  }

  const getTaskFrequency = (frequency: string): number => {
    switch (frequency) {
      case 'Horaire': return 1
      case 'Chaque 2 heures': return 2
      case 'Quotidien': return 24
      case 'Hebdomadaire': return 168
      default: return 1
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <ChefHat className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Gestion de Cuisine Complète</h1>
                <p className="text-sm text-gray-600">Système de gestion HACCP et production</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Commandes actives</div>
                <div className="text-xl font-bold">{getActiveOrders().length}</div>
              </div>
              <Badge variant="outline" className="text-green-600">
                <Activity className="h-4 w-4 mr-1" />
                En service
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-4">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-blue-600">{getActiveOrders().length}</div>
              <div className="text-xs text-gray-600">Actives</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-yellow-600">{orders.filter(o => o.status === 'PENDING').length}</div>
              <div className="text-xs text-gray-600">En attente</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-blue-600">{orders.filter(o => o.status === 'PREPARING').length}</div>
              <div className="text-xs text-gray-600">Préparation</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-green-600">{orders.filter(o => o.status === 'READY').length}</div>
              <div className="text-xs text-gray-600">Prêtes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-purple-600">{Math.round(getHACCPStatus())}%</div>
              <div className="text-xs text-gray-600">HACCP</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-orange-600">{getCriticalAlerts().length}</div>
              <div className="text-xs text-gray-600">Alertes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-red-600">{getOverdueTasks().length}</div>
              <div className="text-xs text-gray-600">Tâches en retard</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-red-600">{inventory.filter(i => ['OUT_OF_STOCK', 'EXPIRED'].includes(i.status)).length}</div>
              <div className="text-xs text-gray-600">Stock critique</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-purple-600">{stations.filter(s => s.status === 'ACTIVE').length}</div>
              <div className="text-xs text-gray-600">Stations actives</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-green-600">{qualityControls.filter(q => q.status === 'PASS').length}</div>
              <div className="text-xs text-gray-600">Contrôles OK</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="commandes" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Commandes
            </TabsTrigger>
            <TabsTrigger value="stations" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Stations
            </TabsTrigger>
            <TabsTrigger value="haccp" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              HACCP
            </TabsTrigger>
            <TabsTrigger value="nettoyage" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Nettoyage
            </TabsTrigger>
            <TabsTrigger value="qualite" className="flex items-center gap-2">
              <ThermometerSun className="h-4 w-4" />
              Qualité
            </TabsTrigger>
            <TabsTrigger value="stocks" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Stocks
            </TabsTrigger>
            <TabsTrigger value="rapports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Rapports
            </TabsTrigger>
          </TabsList>

          {/* Onglet Commandes */}
          <TabsContent value="commandes" className="space-y-4">
            {/* Filtres par station */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Station:</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedStation === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedStation('all')}
                >
                  Toutes
                </Button>
                {stations.map(station => (
                  <Button
                    key={station.id}
                    size="sm"
                    variant={selectedStation === station.id ? 'default' : 'outline'}
                    onClick={() => setSelectedStation(station.id)}
                  >
                    {getStationIcon(station.type)}
                    {station.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Liste des commandes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {getOrdersByStation(selectedStation).map((order) => (
                <Card key={order.id} className={`border-l-4 ${getPriorityColor(order.priority)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {getOrderTypeIcon(order.orderType)}
                            {order.orderNumber}
                          </CardTitle>
                          <CardDescription>
                            {order.orderType === 'DINE_IN' ? `Table ${order.tableNumber}` : order.customerName}
                            {order.serverName && ` • Serveur: ${order.serverName}`}
                            {order.stationName && ` • Station: ${order.stationName}`}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </div>
                    </div>
                    {order.notes && (
                      <Alert className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{order.notes}</AlertDescription>
                      </Alert>
                    )}
                    {order.pickupTime && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Retrait prévu:</span> {new Date(order.pickupTime).toLocaleTimeString()}
                        </div>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.name}</span>
                              <Badge variant="outline">x{item.quantity}</Badge>
                              <Badge className={getStatusColor(item.status)} variant="secondary">
                                {item.status}
                              </Badge>
                            </div>
                            {item.instructions && (
                              <div className="text-sm text-gray-600 mt-1">{item.instructions}</div>
                            )}
                            {item.stationName && (
                              <div className="text-xs text-gray-500 mt-1">
                                Station: {item.stationName}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {item.status === 'PENDING' && (
                              <Button size="sm" onClick={() => {}}>
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            {item.status === 'IN_PROGRESS' && (
                              <Button size="sm" onClick={() => {}}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Stations */}
          <TabsContent value="stations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations.map((station) => (
                <Card key={station.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getStationIcon(station.type)}
                        {station.name}
                      </CardTitle>
                      <Badge className={getStatusColor(station.status)}>
                        {station.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Capacité:</span>
                        <span>{station.currentOrders}/{station.capacity}</span>
                      </div>
                      <Progress value={(station.currentOrders / station.capacity) * 100} />
                      <div className="flex justify-between text-sm">
                        <span>Efficacité:</span>
                        <span>{station.efficiency}%</span>
                      </div>
                      <Progress value={station.efficiency} />
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="h-4 w-4 mr-1" />
                          Configurer
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Activity className="h-4 w-4 mr-1" />
                          Performance
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet HACCP */}
          <TabsContent value="haccp" className="space-y-4">
            {/* Alertes HACCP */}
            {showAlerts && (
              <div className="space-y-2">
                {haccpRecords.filter(record => record.status === 'NON_COMPLIANT' || record.status === 'CRITICAL').map((alert) => (
                  <Alert key={alert.id} className={`border-l-4 ${alert.status === 'CRITICAL' ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'}`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">{alert.item}</span> - {alert.category}
                          <div className="text-sm mt-1">Température: {alert.temperature}°C - {alert.action}</div>
                        </div>
                        <Badge className={alert.status === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}>
                          {alert.status === 'CRITICAL' ? 'CRITIQUE' : 'NON CONFORME'}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Tableau de bord HACCP */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <ThermometerSun className="h-4 w-4 text-blue-600" />
                    Températures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{haccpRecords.length}</div>
                  <div className="text-xs text-gray-600">Contrôles aujourd'hui</div>
                  <div className="mt-2">
                    <div className="text-xs text-green-600">✓ {haccpRecords.filter(r => r.status === 'COMPLIANT').length} conformes</div>
                    <div className="text-xs text-red-600">⚠ {haccpRecords.filter(r => r.status !== 'COMPLIANT').length} alertes</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    Conformité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((haccpRecords.filter(r => r.status === 'COMPLIANT').length / haccpRecords.length) * 100)}%
                  </div>
                  <div className="text-xs text-gray-600">Taux de conformité</div>
                  <Progress 
                    value={(haccpRecords.filter(r => r.status === 'COMPLIANT').length / haccpRecords.length) * 100} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock4 className="h-4 w-4 text-orange-600" />
                    Prochains contrôles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cleaningSchedule.filter(s => s.priority === 'CRITICAL').length}</div>
                  <div className="text-xs text-gray-600">Contrôles critiques</div>
                  <div className="mt-2 space-y-1">
                    {cleaningSchedule.filter(s => s.priority === 'CRITICAL').slice(0, 2).map((task) => (
                      <div key={task.id} className="text-xs text-gray-600">
                        {task.taskName} - {new Date(task.nextDue).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-purple-600" />
                    Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{haccpRecords.length}</div>
                  <div className="text-xs text-gray-600">Enregistrements</div>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    <Download className="h-3 w-3 mr-1" />
                    Exporter HACCP
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contrôles température en temps réel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5" />
                      Contrôles Température
                    </CardTitle>
                    <Button 
                      size="sm" 
                      onClick={() => setShowTempModal(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Nouveau contrôle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {haccpRecords.map((record) => (
                        <div key={record.id} className={`p-3 rounded-lg border ${record.status === 'COMPLIANT' ? 'bg-green-50 border-green-200' : record.status === 'CRITICAL' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">{record.item}</div>
                              <div className="text-xs text-gray-600">{record.category}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Par {record.employee} • {new Date(record.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-lg font-bold ${record.status === 'COMPLIANT' ? 'text-green-600' : record.status === 'CRITICAL' ? 'text-red-600' : 'text-orange-600'}`}>
                                {record.temperature}°C
                              </div>
                              <Badge className={getStatusColor(record.status)} variant="secondary">
                                {record.status === 'COMPLIANT' ? 'Conforme' : record.status === 'CRITICAL' ? 'Critique' : 'Non conforme'}
                              </Badge>
                            </div>
                          </div>
                          {record.action && (
                            <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded">
                              <strong>Action:</strong> {record.action}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5" />
                    Planning des Contrôles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {cleaningSchedule.map((task) => (
                        <div key={task.id} className={`p-3 rounded-lg border ${getPriorityColor(task.priority)}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">{task.taskName}</div>
                              <div className="text-xs text-gray-600">{task.frequency}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Assigné à: {task.assignedTo}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-medium">
                                {new Date(task.nextDue).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <Badge className={getStatusColor(task.status)} variant="secondary">
                                {task.status === 'SCHEDULED' ? 'Planifié' : task.status === 'OVERDUE' ? 'En retard' : task.status}
                              </Badge>
                            </div>
                          </div>
                          {task.verificationRequired && (
                            <div className="mt-2 flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-blue-600" />
                              <span className="text-xs text-blue-600">Vérification requise</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides HACCP */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Actions Rapides HACCP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="flex items-center gap-2 h-auto p-3 flex-col">
                    <ThermometerSun className="h-6 w-6 text-blue-600" />
                    <span className="text-xs">Contrôle température</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 h-auto p-3 flex-col">
                    <Refrigerator className="h-6 w-6 text-cyan-600" />
                    <span className="text-xs">Vérification frigos</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 h-auto p-3 flex-col">
                    <FileText className="h-6 w-6 text-green-600" />
                    <span className="text-xs">Rapport quotidien</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 h-auto p-3 flex-col">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <span className="text-xs">Alerte critique</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Nettoyage */}
          <TabsContent value="nettoyage" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {cleaningTasks.map((task) => (
                <Card key={task.id} className={`border-l-4 ${getPriorityColor(task.priority)}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getCleaningIcon(task.type)}
                        {task.title}
                      </CardTitle>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                    <CardDescription>{task.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Fréquence:</span>
                          <div className="font-medium">{task.frequency}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Durée estimée:</span>
                          <div className="font-medium">{task.estimatedDuration} min</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Station:</span>
                          <div className="font-medium">{task.stationName || 'Général'}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Prochaine échéance:</span>
                          <div className="font-medium">{new Date(task.nextDue).toLocaleString()}</div>
                        </div>
                      </div>
                      {task.lastCompleted && (
                        <div className="text-sm">
                          <span className="text-gray-600">Dernière réalisation:</span>
                          <div className="font-medium">{new Date(task.lastCompleted).toLocaleString()}</div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {task.status === 'PENDING' && (
                          <Button size="sm" className="flex-1">
                            <Play className="h-4 w-4 mr-1" />
                            Commencer
                          </Button>
                        )}
                        {task.status === 'IN_PROGRESS' && (
                          <Button size="sm" className="flex-1">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Terminer
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Qualité */}
          <TabsContent value="qualite" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {qualityControls.map((control) => (
                <Card key={control.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Thermometer className="h-5 w-5" />
                        {control.type.replace('_', ' ')}
                      </CardTitle>
                      <Badge className={getStatusColor(control.status)}>
                        {control.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {control.stationName && `Station: ${control.stationName}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {control.temperature !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Température:</span>
                          <span className="font-medium">{control.temperature}°C</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Contrôlé par:</span>
                        <span className="font-medium">{control.checkedBy}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Date:</span>
                        <span className="font-medium">{new Date(control.checkedAt).toLocaleString()}</span>
                      </div>
                      {control.notes && (
                        <div className="text-sm">
                          <span className="text-gray-600">Notes:</span>
                          <div className="mt-1">{control.notes}</div>
                        </div>
                      )}
                      <Button size="sm" variant="outline" className="w-full">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Nouveau contrôle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Stocks */}
          <TabsContent value="stocks" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {inventory.map((item) => (
                <Card key={item.id} className={`border-l-4 ${getPriorityColor(item.status)}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardDescription>{item.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Quantité:</span>
                        <span className="font-medium">{item.quantity} {item.unit}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Minimum:</span>
                        <span className="font-medium">{item.minQuantity} {item.unit}</span>
                      </div>
                      <Progress 
                        value={Math.min((item.quantity / item.minQuantity) * 100, 100)} 
                        className="h-2"
                      />
                      {item.expiryDate && (
                        <div className="text-sm">
                          <span className="text-gray-600">Expiration:</span>
                          <div className="font-medium">{new Date(item.expiryDate).toLocaleDateString()}</div>
                        </div>
                      )}
                      {item.location && (
                        <div className="text-sm">
                          <span className="text-gray-600">Emplacement:</span>
                          <div className="font-medium">{item.location}</div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Plus className="h-4 w-4 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Rapports */}
          <TabsContent value="rapports" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance du jour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">47</div>
                        <div className="text-sm text-gray-600">Commandes traitées</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">18min</div>
                        <div className="text-sm text-gray-600">Temps moyen</div>
                      </div>
                    </div>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-1" />
                      Exporter le rapport
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Conformité HACCP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">98%</div>
                        <div className="text-sm text-gray-600">Taux de conformité</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">2</div>
                        <div className="text-sm text-gray-600">Actions correctives</div>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Shield className="h-4 w-4 mr-1" />
                      Voir les détails
                    </Button>
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