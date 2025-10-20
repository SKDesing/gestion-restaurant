"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/lib/useSocket";

export default function CaissePage() {
  const { socket, connected } = useSocket("/caisse");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.on("pong", (data) =>
      setMessages((m) => [...m, `Pong: ${JSON.stringify(data)}`]),
    );
    socket.emit("ping", { from: "caisse", ts: Date.now() });
  }, [socket]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🟢 Caisse & Bar</h1>
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  CreditCard,
  DollarSign,
  Smartphone,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Bell,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Printer,
  Coffee,
  Wine,
  Beer,
  Banknote,
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  status: string;
  tableNumber?: string;
  customerName?: string;
  paymentMethod?: string;
  createdAt: string;
}

interface Notification {
  id: string;
  type: "NEW_ORDER" | "ORDER_READY" | "PAYMENT_REQUEST" | "ALERT";
  message: string;
  timestamp: string;
  read: boolean;
}

export default function CaisseCentrale() {
  const [activeTab, setActiveTab] = useState("ventes");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Partial<Order>>({
    items: [],
    total: 0,
    status: "PENDING",
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [todayStats, setTodayStats] = useState({
    totalSales: 2847.5,
    totalOrders: 156,
    cashSales: 1247.5,
    cardSales: 1600.0,
    averageOrder: 18.25,
  });

  const [menuCategories] = useState([
    {
      name: "Boissons Chaudes",
      icon: <Coffee className="h-5 w-5" />,
      items: [
        { id: "cafe1", name: "Café Expresso", price: 2.5, category: "Chaud" },
        { id: "cafe2", name: "Café Crème", price: 3.0, category: "Chaud" },
        { id: "the1", name: "Thé Nature", price: 2.5, category: "Chaud" },
        { id: "choco1", name: "Chocolat Chaud", price: 3.5, category: "Chaud" },
      ],
    },
    {
      name: "Boissons Froides",
      icon: <Beer className="h-5 w-5" />,
      items: [
        { id: "coca1", name: "Coca-Cola", price: 3.0, category: "Froid" },
        { id: "eau1", name: "Eau Minérale", price: 2.0, category: "Froid" },
        { id: "jus1", name: "Jus d'Orange", price: 4.0, category: "Froid" },
        { id: "smoothie1", name: "Smoothie", price: 5.5, category: "Froid" },
      ],
    },
    {
      name: "Vins & Alcools",
      icon: <Wine className="h-5 w-5" />,
      items: [
        {
          id: "vin1",
          name: "Vin Rouge (verre)",
          price: 6.0,
          category: "Alcool",
        },
        {
          id: "vin2",
          name: "Vin Blanc (verre)",
          price: 6.0,
          category: "Alcool",
        },
        {
          id: "biere1",
          name: "Bière Pression",
          price: 4.5,
          category: "Alcool",
        },
        {
          id: "cocktail1",
          name: "Cocktail Maison",
          price: 8.0,
          category: "Alcool",
        },
      ],
    },
  ]);

  const [recentOrders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "BAR-001",
      items: [
        {
          id: "1",
          name: "Café Expresso",
          price: 2.5,
          quantity: 2,
          category: "Chaud",
        },
        {
          id: "2",
          name: "Croissant",
          price: 2.0,
          quantity: 1,
          category: "Pâtisserie",
        },
      ],
      total: 7.0,
      status: "COMPLETED",
      customerName: "Client Comptoir",
      paymentMethod: "CASH",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      orderNumber: "BAR-002",
      items: [
        {
          id: "3",
          name: "Vin Rouge (verre)",
          price: 6.0,
          quantity: 1,
          category: "Alcool",
        },
        {
          id: "4",
          name: "Assiette Fromage",
          price: 8.5,
          quantity: 1,
          category: "Plat",
        },
      ],
      total: 14.5,
      status: "PENDING",
      tableNumber: "T6",
      customerName: "Table 6",
      createdAt: "2024-01-15T11:15:00Z",
    },
  ]);

  useEffect(() => {
    // Simuler les notifications en temps réel
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: "NEW_ORDER",
        message: "Nouvelle commande de la table T3",
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
    }, 30000); // Nouvelle notification toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const addToCart = (item: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const processPayment = (method: string) => {
    if (cart.length === 0) return;

    const order: Order = {
      id: Date.now().toString(),
      orderNumber: `BAR-${String(recentOrders.length + 1).padStart(3, "0")}`,
      items: [...cart],
      total: calculateTotal(),
      status: "COMPLETED",
      paymentMethod: method,
      createdAt: new Date().toISOString(),
    };

    // Envoyer la commande à la cuisine si nécessaire
    const hasFoodItems = cart.some(
      (item) =>
        item.category !== "Alcool" &&
        item.category !== "Froid" &&
        item.category !== "Chaud",
    );
    if (hasFoodItems) {
      // Ici on enverrait à la cuisine via Socket.io
      console.log("Envoi à la cuisine:", order);
    }

    // Vider le panier
    setCart([]);

    // Mettre à jour les statistiques
    setTodayStats((prev) => ({
      ...prev,
      totalSales: prev.totalSales + order.total,
      totalOrders: prev.totalOrders + 1,
      [method === "CASH" ? "cashSales" : "cardSales"]:
        prev[method === "CASH" ? "cashSales" : "cardSales"] + order.total,
    }));
  };

  const printReceipt = (order: Order) => {
    // Simuler l'impression du ticket
    console.log("Impression du ticket:", order);
    alert(`Ticket imprimé pour la commande ${order.orderNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Caisse Centrale - Bar</h1>
                <p className="text-sm text-gray-600">
                  Gestion des ventes et encaissements
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </div>
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Ouvert
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats du jour */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ventes du jour</p>
                  <p className="text-xl font-bold">
                    €{todayStats.totalSales.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Commandes</p>
                  <p className="text-xl font-bold">{todayStats.totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Espèces</p>
                  <p className="text-xl font-bold">
                    €{todayStats.cashSales.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Carte</p>
                  <p className="text-xl font-bold">
                    €{todayStats.cardSales.toFixed(2)}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Moyenne</p>
                  <p className="text-xl font-bold">
                    €{todayStats.averageOrder.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Menu et Panier */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ventes">Ventes</TabsTrigger>
                <TabsTrigger value="commandes">Commandes</TabsTrigger>
                <TabsTrigger value="historique">Historique</TabsTrigger>
              </TabsList>

              <TabsContent value="ventes" className="space-y-4">
                {/* Menu Categories */}
                <div className="space-y-4">
                  {menuCategories.map((category) => (
                    <Card key={category.name}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {category.icon}
                          {category.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {category.items.map((item) => (
                            <Button
                              key={item.id}
                              variant="outline"
                              className="h-auto p-3 flex flex-col items-center gap-2"
                              onClick={() => addToCart(item)}
                            >
                              <span className="font-medium text-sm">
                                {item.name}
                              </span>
                              <span className="text-lg font-bold text-blue-600">
                                €{item.price.toFixed(2)}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="commandes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Commandes en cours</CardTitle>
                    <CardDescription>
                      Commandes des tables en attente de paiement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentOrders
                        .filter((order) => order.status === "PENDING")
                        .map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="font-medium">
                                  {order.orderNumber}
                                </span>
                                <span className="ml-2 text-sm text-gray-600">
                                  {order.tableNumber} • {order.customerName}
                                </span>
                              </div>
                              <Badge variant="outline">{order.status}</Badge>
                            </div>
                            <div className="space-y-1 mb-3">
                              {order.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="text-sm flex justify-between"
                                >
                                  <span>
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span>
                                    €{(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold">
                                Total: €{order.total.toFixed(2)}
                              </span>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Receipt className="h-4 w-4 mr-1" />
                                  Détails
                                </Button>
                                <Button size="sm">
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  Encaisser
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="historique" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des ventes</CardTitle>
                    <CardDescription>Dernières transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentOrders
                        .filter((order) => order.status === "COMPLETED")
                        .map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">
                                  {order.orderNumber}
                                </span>
                                <span className="ml-2 text-sm text-gray-600">
                                  {order.customerName}
                                </span>
                                <div className="text-sm text-gray-500">
                                  {new Date(
                                    order.createdAt,
                                  ).toLocaleTimeString()}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    order.paymentMethod === "CASH"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {order.paymentMethod === "CASH" ? (
                                    <Banknote className="h-3 w-3 mr-1" />
                                  ) : (
                                    <CreditCard className="h-3 w-3 mr-1" />
                                  )}
                                  {order.paymentMethod}
                                </Badge>
                                <span className="font-bold">
                                  €{order.total.toFixed(2)}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => printReceipt(order)}
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Panier et Paiement */}
          <div className="space-y-4">
            {/* Panier */}
            <Card>
              <CardHeader>
                <CardTitle>Panier</CardTitle>
                <CardDescription>{cart.length} articles</CardDescription>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2" />
                    <p>Panier vide</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">
                            €{item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-lg">
                        €{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Paiement */}
            <Card>
              <CardHeader>
                <CardTitle>Paiement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full h-12"
                  onClick={() => processPayment("CASH")}
                  disabled={cart.length === 0}
                >
                  <Banknote className="h-5 w-5 mr-2" />
                  Espèces
                </Button>
                <Button
                  className="w-full h-12"
                  variant="outline"
                  onClick={() => processPayment("CARD")}
                  disabled={cart.length === 0}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Carte Bancaire
                </Button>
                <Button
                  className="w-full h-12"
                  variant="outline"
                  onClick={() => processPayment("MOBILE")}
                  disabled={cart.length === 0}
                >
                  <Smartphone className="h-5 w-5 mr-2" />
                  Mobile
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">Aucune notification</p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-2 rounded text-sm ${notification.read ? "bg-gray-50" : "bg-blue-50"}`}
                      >
                        <div className="flex items-center gap-2">
                          {notification.type === "NEW_ORDER" && (
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                          )}
                          {notification.type === "ORDER_READY" && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          <span>{notification.message}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(
                            notification.timestamp,
                          ).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
