"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/lib/useSocket";

export default function CuisinePage() {
  const { socket, connected } = useSocket("/cuisine");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.on("pong", (data) =>
      setMessages((m) => [...m, `Pong: ${JSON.stringify(data)}`]),
    );
    socket.emit("ping", { from: "cuisine", ts: Date.now() });
  }, [socket]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🟠 Cuisine</h1>
      <div>Status: {connected ? "✅ Connected" : "❌ Disconnected"}</div>
      <div className="mt-4 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className="p-2 bg-gray-100 rounded">
            {m}
          </div>
        ))}
      </div>
    </div>
  );
}
("use client");

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ChefHat,
  Flame,
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
} from "lucide-react";

interface KitchenOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  items: KitchenOrderItem[];
  status: "PENDING" | "PREPARING" | "READY" | "DELIVERED";
  priority: "low" | "medium" | "high";
  orderTime: string;
  estimatedTime?: number;
  actualTime?: number;
  notes?: string;
  serverName?: string;
}

interface KitchenOrderItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  instructions?: string;
  status: "PENDING" | "PREPARING" | "READY";
  startedAt?: string;
  completedAt?: string;
  estimatedTime?: number;
}

interface KitchenStats {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
  averagePreparationTime: number;
  ordersPerHour: number;
}

export default function CuisineTablette() {
  const [activeTab, setActiveTab] = useState("en-cours");
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [stats, setStats] = useState<KitchenStats>({
    totalOrders: 45,
    pendingOrders: 3,
    preparingOrders: 5,
    readyOrders: 2,
    averagePreparationTime: 18,
    ordersPerHour: 12,
  });

  const [initialOrders] = useState<KitchenOrder[]>([
    {
      id: "1",
      orderNumber: "CMD-001",
      tableNumber: "T2",
      status: "PREPARING",
      priority: "medium",
      orderTime: "2024-01-15T12:30:00Z",
      estimatedTime: 25,
      actualTime: 15,
      notes: "Client allergique aux noix",
      serverName: "Marie",
      items: [
        {
          id: "1",
          name: "Steak Frites",
          quantity: 1,
          category: "Plat",
          instructions: "Saignant",
          status: "PREPARING",
          startedAt: "2024-01-15T12:32:00Z",
          estimatedTime: 20,
        },
        {
          id: "2",
          name: "Salade César",
          quantity: 1,
          category: "Entrée",
          instructions: "Sans croûtons",
          status: "READY",
          startedAt: "2024-01-15T12:31:00Z",
          completedAt: "2024-01-15T12:40:00Z",
          estimatedTime: 10,
        },
      ],
    },
    {
      id: "2",
      orderNumber: "CMD-002",
      tableNumber: "T4",
      status: "PENDING",
      priority: "high",
      orderTime: "2024-01-15T12:35:00Z",
      estimatedTime: 30,
      serverName: "Pierre",
      items: [
        {
          id: "3",
          name: "Saumon Grillé",
          quantity: 2,
          category: "Plat",
          instructions: "Bien cuit",
          status: "PENDING",
          estimatedTime: 25,
        },
        {
          id: "4",
          name: "Risotto aux Champignons",
          quantity: 1,
          category: "Plat",
          instructions: "Extra parmesan",
          status: "PENDING",
          estimatedTime: 30,
        },
      ],
    },
    {
      id: "3",
      orderNumber: "CMD-003",
      tableNumber: "T1",
      status: "READY",
      priority: "low",
      orderTime: "2024-01-15T12:15:00Z",
      estimatedTime: 15,
      actualTime: 12,
      serverName: "Sophie",
      items: [
        {
          id: "5",
          name: "Soupe à l'oignon",
          quantity: 2,
          category: "Entrée",
          status: "READY",
          startedAt: "2024-01-15T12:16:00Z",
          completedAt: "2024-01-15T12:27:00Z",
          estimatedTime: 15,
        },
        {
          id: "6",
          name: "Croque-monsieur",
          quantity: 2,
          category: "Plat",
          status: "READY",
          startedAt: "2024-01-15T12:18:00Z",
          completedAt: "2024-01-15T12:30:00Z",
          estimatedTime: 12,
        },
      ],
    },
  ]);

  useEffect(() => {
    setOrders(initialOrders);

    // Simuler les nouvelles commandes
    const interval = setInterval(() => {
      const newOrder: KitchenOrder = {
        id: Date.now().toString(),
        orderNumber: `CMD-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
        tableNumber: `T${Math.floor(Math.random() * 6) + 1}`,
        status: "PENDING",
        priority: Math.random() > 0.7 ? "high" : "medium",
        orderTime: new Date().toISOString(),
        estimatedTime: Math.floor(Math.random() * 20) + 15,
        serverName: ["Marie", "Pierre", "Sophie"][
          Math.floor(Math.random() * 3)
        ],
        items: [
          {
            id: Date.now().toString(),
            name: ["Steak Frites", "Saumon Grillé", "Risotto", "Burger"][
              Math.floor(Math.random() * 4)
            ],
            quantity: Math.floor(Math.random() * 3) + 1,
            category: "Plat",
            status: "PENDING",
            estimatedTime: Math.floor(Math.random() * 20) + 15,
          },
        ],
      };

      setOrders((prev) => [newOrder, ...prev]);

      // Jouer un son de notification (simulé)
      console.log("🔔 Nouvelle commande reçue!");
    }, 45000); // Nouvelle commande toutes les 45 secondes

    return () => clearInterval(interval);
  }, []);

  const updateItemStatus = (
    orderId: string,
    itemId: string,
    newStatus: string,
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((item) => {
            if (item.id === itemId) {
              const updatedItem = { ...item, status: newStatus as any };

              if (newStatus === "PREPARING" && !item.startedAt) {
                updatedItem.startedAt = new Date().toISOString();
              } else if (newStatus === "READY" && !item.completedAt) {
                updatedItem.completedAt = new Date().toISOString();
              }

              return updatedItem;
            }
            return item;
          });

          // Mettre à jour le statut de la commande
          const allReady = updatedItems.every(
            (item) => item.status === "READY",
          );
          const anyPreparing = updatedItems.some(
            (item) => item.status === "PREPARING",
          );
          const allPending = updatedItems.every(
            (item) => item.status === "PENDING",
          );

          let newOrderStatus = order.status;
          if (allReady) newOrderStatus = "READY";
          else if (anyPreparing) newOrderStatus = "PREPARING";
          else if (allPending) newOrderStatus = "PENDING";

          return {
            ...order,
            items: updatedItems,
            status: newOrderStatus as any,
          };
        }
        return order;
      }),
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: newStatus as any };

          if (newStatus === "DELIVERED") {
            // Notifier le serveur que la commande est prête
            console.log(
              `📢 Commande ${order.orderNumber} prête pour la table ${order.tableNumber}`,
            );
            alert(
              `Commande ${order.orderNumber} prête! Serveur ${order.serverName} notifié.`,
            );
          }

          return updatedOrder;
        }
        return order;
      }),
    );
  };

  const startPreparation = (orderId: string, itemId: string) => {
    updateItemStatus(orderId, itemId, "PREPARING");
  };

  const markItemReady = (orderId: string, itemId: string) => {
    updateItemStatus(orderId, itemId, "READY");
  };

  const markOrderReady = (orderId: string) => {
    updateOrderStatus(orderId, "READY");
  };

  const markOrderDelivered = (orderId: string) => {
    updateOrderStatus(orderId, "DELIVERED");
  };

  const printTicket = (order: KitchenOrder) => {
    console.log("🎫 Impression du ticket:", order);
    alert(`Ticket imprimé pour la commande ${order.orderNumber}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PREPARING":
        return "bg-blue-100 text-blue-800";
      case "READY":
        return "bg-green-100 text-green-800";
      case "DELIVERED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "PREPARING":
        return <Play className="h-4 w-4" />;
      case "READY":
        return <CheckCircle className="h-4 w-4" />;
      case "DELIVERED":
        return <CheckSquare className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const calculateOrderProgress = (order: KitchenOrder) => {
    const totalItems = order.items.length;
    const readyItems = order.items.filter(
      (item) => item.status === "READY",
    ).length;
    return (readyItems / totalItems) * 100;
  };

  const getTimeElapsed = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000 / 60); // minutes
    return diff;
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter((order) => order.status === status);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Cuisine - Tablet de Commandes
                </h1>
                <p className="text-sm text-gray-600">
                  Gestion des commandes en temps réel
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Commandes actives</div>
                <div className="text-xl font-bold">
                  {orders.filter((o) => o.status !== "DELIVERED").length}
                </div>
              </div>
              <Badge variant="outline" className="text-green-600">
                <Flame className="h-4 w-4 mr-1" />
                En service
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalOrders}
              </div>
              <div className="text-xs text-gray-600">Total commandes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingOrders}
              </div>
              <div className="text-xs text-gray-600">En attente</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.preparingOrders}
              </div>
              <div className="text-xs text-gray-600">En préparation</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.readyOrders}
              </div>
              <div className="text-xs text-gray-600">Prêtes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.averagePreparationTime}
              </div>
              <div className="text-xs text-gray-600">Temps moyen</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.ordersPerHour}
              </div>
              <div className="text-xs text-gray-600">Commandes/heure</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="en-cours" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              En cours (
              {getOrdersByStatus("PENDING").length +
                getOrdersByStatus("PREPARING").length}
              )
            </TabsTrigger>
            <TabsTrigger value="pretes" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Prêtes ({getOrdersByStatus("READY").length})
            </TabsTrigger>
            <TabsTrigger value="terminees" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Terminées
            </TabsTrigger>
            <TabsTrigger value="toutes" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Toutes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="en-cours" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {getOrdersByStatus("PENDING")
                .concat(getOrdersByStatus("PREPARING"))
                .map((order) => (
                  <Card
                    key={order.id}
                    className={`border-l-4 ${getPriorityColor(order.priority)}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <CardTitle className="text-lg">
                              {order.orderNumber}
                            </CardTitle>
                            <CardDescription>
                              Table {order.tableNumber} • Serveur:{" "}
                              {order.serverName}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => printTicket(order)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Badge className={getPriorityColor(order.priority)}>
                            {order.priority}
                          </Badge>
                        </div>
                      </div>
                      {order.notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                          <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium">Note:</span>{" "}
                            {order.notes}
                          </div>
                        </div>
                      )}
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progression</span>
                          <span>
                            {Math.round(calculateOrderProgress(order))}%
                          </span>
                        </div>
                        <Progress
                          value={calculateOrderProgress(order)}
                          className="h-2"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.name}</span>
                              <Badge variant="outline">x{item.quantity}</Badge>
                              <Badge className={getStatusColor(item.status)}>
                                {getStatusIcon(item.status)}
                                <span className="ml-1">{item.status}</span>
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              {item.status === "PENDING" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    startPreparation(order.id, item.id)
                                  }
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Play className="h-3 w-3" />
                                </Button>
                              )}
                              {item.status === "PREPARING" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    markItemReady(order.id, item.id)
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          {item.instructions && (
                            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              Instructions: {item.instructions}
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            {item.startedAt && (
                              <span>
                                Début: {getTimeElapsed(item.startedAt)} min
                              </span>
                            )}
                            {item.estimatedTime && (
                              <span>Estimé: {item.estimatedTime} min</span>
                            )}
                          </div>
                        </div>
                      ))}
                      {order.status === "PREPARING" &&
                        calculateOrderProgress(order) === 100 && (
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => markOrderReady(order.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marquer commande comme prête
                          </Button>
                        )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="pretes" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {getOrdersByStatus("READY").map((order) => (
                <Card key={order.id} className="border-l-4 border-green-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {order.orderNumber}
                        </CardTitle>
                        <CardDescription>
                          Table {order.tableNumber} • Serveur:{" "}
                          {order.serverName}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => markOrderDelivered(order.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckSquare className="h-4 w-4 mr-1" />
                          Livrée
                        </Button>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Prête
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center"
                        >
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Prêt
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <Bell className="h-4 w-4" />
                        <span className="font-medium">
                          Prête à être servie!
                        </span>
                      </div>
                      <div className="text-sm text-green-700 mt-1">
                        Notifier le serveur {order.serverName} pour la table{" "}
                        {order.tableNumber}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="terminees" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {getOrdersByStatus("DELIVERED").map((order) => (
                <Card key={order.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {order.orderNumber}
                        </CardTitle>
                        <CardDescription>
                          Table {order.tableNumber} • {order.serverName}
                        </CardDescription>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800">
                        <CheckSquare className="h-3 w-3 mr-1" />
                        Terminée
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="text-sm justify-between flex"
                        >
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Terminée à {new Date().toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="toutes" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className={`border-l-4 ${getPriorityColor(order.priority)}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {order.orderNumber}
                        </CardTitle>
                        <CardDescription>
                          Table {order.tableNumber} • {order.serverName}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center"
                        >
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
