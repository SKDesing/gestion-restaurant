// @ts-nocheck
import { db } from '@/lib/db'
import { hash } from 'bcryptjs'

async function main() {
  console.log('🌱 Seeding database...')

  // Create restaurant
  const restaurant = await db.restaurant.create({
    data: {
      name: 'Restaurant Le Gourmet',
      address: '123 Rue de la Gastronomie, 75001 Paris',
      phone: '01 23 45 67 89',
      email: 'contact@legourmet.fr',
      description: 'Restaurant français traditionnel avec une touche moderne',
    },
  })

  console.log('✅ Restaurant created:', restaurant.name)

  // Create categories
  const categories = await Promise.all([
    db.category.create({
      data: {
        name: 'Entrées',
        description: 'Nos délicieuses entrées',
        icon: '🥗',
        displayOrder: 1,
        restaurantId: restaurant.id,
      },
    }),
    db.category.create({
      data: {
        name: 'Plats Principaux',
        description: 'Nos plats signature',
        icon: '🍽️',
        displayOrder: 2,
        restaurantId: restaurant.id,
      },
    }),
    db.category.create({
      data: {
        name: 'Desserts',
        description: 'Nos douceurs maison',
        icon: '🍰',
        displayOrder: 3,
        restaurantId: restaurant.id,
      },
    }),
    db.category.create({
      data: {
        name: 'Boissons',
        description: 'Nos boissons rafraîchissantes',
        icon: '🥤',
        displayOrder: 4,
        restaurantId: restaurant.id,
      },
    }),
  ])

  console.log('✅ Categories created')

  // Create tables
  const tables = await Promise.all([
    db.table.create({
      data: {
        number: 'T1',
        capacity: 2,
        status: 'AVAILABLE',
        location: 'Terrasse',
        restaurantId: restaurant.id,
      },
    }),
    db.table.create({
      data: {
        number: 'T2',
        capacity: 4,
        status: 'AVAILABLE',
        location: 'Terrasse',
        restaurantId: restaurant.id,
      },
    }),
    db.table.create({
      data: {
        number: 'T3',
        capacity: 4,
        status: 'AVAILABLE',
        location: 'Salle Principale',
        restaurantId: restaurant.id,
      },
    }),
    db.table.create({
      data: {
        number: 'T4',
        capacity: 6,
        status: 'AVAILABLE',
        location: 'Salle Principale',
        restaurantId: restaurant.id,
      },
    }),
    db.table.create({
      data: {
        number: 'T5',
        capacity: 8,
        status: 'AVAILABLE',
        location: 'Privé',
        restaurantId: restaurant.id,
      },
    }),
    db.table.create({
      data: {
        number: 'T6',
        capacity: 2,
        status: 'AVAILABLE',
        location: 'Bar',
        restaurantId: restaurant.id,
      },
    }),
  ])

  console.log('✅ Tables created')

  // Create inventory items
  const inventoryItems = await Promise.all([
    db.inventoryItem.create({
      data: {
        name: 'Farine',
        category: 'Épicerie',
        unit: 'kg',
        currentStock: 50,
        minStock: 10,
        maxStock: 100,
        unitCost: 2.50,
        restaurantId: restaurant.id,
      },
    }),
    db.inventoryItem.create({
      data: {
        name: 'Huile d\'olive',
        category: 'Épicerie',
        unit: 'L',
        currentStock: 15,
        minStock: 5,
        maxStock: 50,
        unitCost: 8.00,
        restaurantId: restaurant.id,
      },
    }),
    db.inventoryItem.create({
      data: {
        name: 'Tomates',
        category: 'Légumes',
        unit: 'kg',
        currentStock: 20,
        minStock: 8,
        maxStock: 40,
        unitCost: 3.50,
        restaurantId: restaurant.id,
      },
    }),
    db.inventoryItem.create({
      data: {
        name: 'Fromage',
        category: 'Produits laitiers',
        unit: 'kg',
        currentStock: 8,
        minStock: 3,
        maxStock: 20,
        unitCost: 12.00,
        restaurantId: restaurant.id,
      },
    }),
    db.inventoryItem.create({
      data: {
        name: 'Pain',
        category: 'Boulangerie',
        unit: 'pièce',
        currentStock: 30,
        minStock: 10,
        maxStock: 60,
        unitCost: 1.50,
        restaurantId: restaurant.id,
      },
    }),
  ])

  console.log('✅ Inventory items created')

  // Create menu items
  const menuItems = await Promise.all([
    db.menuItem.create({
      data: {
        name: 'Salade César',
        description: 'Laitue fraîche, poulet grillé, parmesan, croutons',
        price: 12.00,
        cost: 4.50,
        category: 'Salade',
        vegetarian: false,
        available: true,
        preparationTime: 15,
        calories: 350,
        categoryId: categories[0].id,
        restaurantId: restaurant.id,
      },
    }),
    db.menuItem.create({
      data: {
        name: 'Soupe à l\'oignon',
        description: 'Soupe traditionnelle française avec fromage gratiné',
        price: 8.50,
        cost: 2.80,
        category: 'Soupe',
        vegetarian: true,
        available: true,
        preparationTime: 20,
        calories: 280,
        categoryId: categories[0].id,
        restaurantId: restaurant.id,
      },
    }),
    db.menuItem.create({
      data: {
        name: 'Steak Frites',
        description: 'Steak de bœuf grillé avec frites maison',
        price: 18.50,
        cost: 8.20,
        category: 'Viande',
        vegetarian: false,
        available: true,
        preparationTime: 25,
        calories: 650,
        categoryId: categories[1].id,
        restaurantId: restaurant.id,
      },
    }),
    db.menuItem.create({
      data: {
        name: 'Saumon Grillé',
        description: 'Saumon frais grillé avec légumes de saison',
        price: 22.00,
        cost: 10.50,
        category: 'Poisson',
        vegetarian: false,
        available: true,
        preparationTime: 30,
        calories: 480,
        categoryId: categories[1].id,
        restaurantId: restaurant.id,
      },
    }),
    db.menuItem.create({
      data: {
        name: 'Risotto aux Champignons',
        description: 'Risotto crémeux avec champignons sauvages',
        price: 16.50,
        cost: 6.80,
        category: 'Végétarien',
        vegetarian: true,
        available: true,
        preparationTime: 35,
        calories: 420,
        categoryId: categories[1].id,
        restaurantId: restaurant.id,
      },
    }),
    db.menuItem.create({
      data: {
        name: 'Tiramisu',
        description: 'Dessert italien classique avec café et mascarpone',
        price: 7.50,
        cost: 2.50,
        category: 'Dessert',
        vegetarian: true,
        available: true,
        preparationTime: 10,
        calories: 380,
        categoryId: categories[2].id,
        restaurantId: restaurant.id,
      },
    }),
    db.menuItem.create({
      data: {
        name: 'Crème Brûlée',
        description: 'Crème vanille avec sucre caramélisé',
        price: 8.00,
        cost: 3.20,
        category: 'Dessert',
        vegetarian: true,
        available: true,
        preparationTime: 10,
        calories: 320,
        categoryId: categories[2].id,
        restaurantId: restaurant.id,
      },
    }),
    db.menuItem.create({
      data: {
        name: 'Coca-Cola',
        description: 'Boisson gazeuse classique',
        price: 3.00,
        cost: 0.80,
        category: 'Soda',
        vegetarian: true,
        available: true,
        preparationTime: 2,
        calories: 140,
        categoryId: categories[3].id,
        restaurantId: restaurant.id,
      },
    }),
    db.menuItem.create({
      data: {
        name: 'Vin Rouge',
        description: 'Vin rouge de la région',
        price: 6.00,
        cost: 2.50,
        category: 'Vin',
        vegetarian: true,
        available: true,
        preparationTime: 2,
        calories: 125,
        categoryId: categories[3].id,
        restaurantId: restaurant.id,
      },
    }),
  ])

  console.log('✅ Menu items created')

  // Create employees
  // Hash a default password for seeded employees (bcrypt, 10 rounds)
  const defaultPassword = await hash('ChangeMe123!', 10)

  const employees = await Promise.all([
    db.employee.create({
      // Cast to any to allow specifying password in seed (Prisma type may differ)
      data: {
        name: 'Jean Dupont',
        email: 'jean.dupont@legourmet.fr',
        password: defaultPassword,
        phone: '06 12 34 56 78',
        role: 'MANAGER',
        salary: 3500.0,
        hireDate: new Date('2023-01-15'),
        status: 'ACTIVE',
        restaurantId: restaurant.id,
      } as any,
    }),
    db.employee.create({
      data: {
        name: 'Marie Martin',
        email: 'marie.martin@legourmet.fr',
        password: defaultPassword,
        phone: '06 23 45 67 89',
        role: 'WAITER',
        salary: 1800.0,
        hireDate: new Date('2023-03-20'),
        status: 'ACTIVE',
        restaurantId: restaurant.id,
      } as any,
    }),
    db.employee.create({
      data: {
        name: 'Pierre Bernard',
        email: 'pierre.bernard@legourmet.fr',
        password: defaultPassword,
        phone: '06 34 56 78 90',
        role: 'CHEF',
        salary: 2800.0,
        hireDate: new Date('2023-02-10'),
        status: 'ACTIVE',
        restaurantId: restaurant.id,
      } as any,
    }),
    db.employee.create({
      data: {
        name: 'Sophie Petit',
        email: 'sophie.petit@legourmet.fr',
        password: defaultPassword,
        phone: '06 45 67 89 01',
        role: 'BARTENDER',
        salary: 1600.0,
        hireDate: new Date('2023-04-05'),
        status: 'ACTIVE',
        restaurantId: restaurant.id,
      } as any,
    }),
  ])

  console.log('✅ Employees created')

  // Create suppliers
  const suppliers = await Promise.all([
    db.supplier.create({
      data: {
        name: 'Fournisseur Local',
        contactPerson: 'Michel Durand',
        email: 'contact@fournisseurlocal.fr',
        phone: '01 23 45 67 89',
        address: '456 Rue des Fournisseurs, 75002 Paris',
        category: 'Produits frais',
        restaurantId: restaurant.id,
      },
    }),
    db.supplier.create({
      data: {
        name: 'Boissons & Cie',
        contactPerson: 'Isabelle Martin',
        email: 'isabelle@boissons.fr',
        phone: '01 98 76 54 32',
        address: '789 Avenue des Boissons, 75003 Paris',
        category: 'Boissons',
        restaurantId: restaurant.id,
      },
    }),
    db.supplier.create({
      data: {
        name: 'Épicerie Fine',
        contactPerson: 'Robert Bernard',
        email: 'robert@epiceriefine.fr',
        phone: '01 11 22 33 44',
        address: '321 Rue de l\'Épicerie, 75004 Paris',
        category: 'Épicerie',
        restaurantId: restaurant.id,
      },
    }),
  ])

  console.log('✅ Suppliers created')

  // Create customers
  const customers = await Promise.all([
    db.customer.create({
      data: {
        name: 'Client Test',
        email: 'client@test.fr',
        phone: '06 12 34 56 78',
        address: '123 Rue du Client, 75001 Paris',
        loyaltyPoints: 150,
      },
    }),
    db.customer.create({
      data: {
        name: 'Marie Client',
        email: 'marie.client@exemple.fr',
        phone: '06 23 45 67 89',
        loyaltyPoints: 320,
      },
    }),
  ])

  console.log('✅ Customers created')

  // Create sample orders
  const orders = await Promise.all([
    db.order.create({
      data: {
        orderNumber: 'CMD-001',
        status: 'COMPLETED',
        subtotal: 45.50,
        tax: 9.10,
        tip: 5.00,
        total: 59.60,
        paymentMethod: 'CARD',
        paymentStatus: 'PAID',
        tableId: tables[0].id,
        customerId: customers[0].id,
        employeeId: employees[1].id,
        restaurantId: restaurant.id,
        orderItems: {
          create: [
            {
              quantity: 1,
              unitPrice: 12.00,
              totalPrice: 12.00,
              menuItemId: menuItems[0].id,
            },
            {
              quantity: 1,
              unitPrice: 18.50,
              totalPrice: 18.50,
              menuItemId: menuItems[2].id,
            },
            {
              quantity: 1,
              unitPrice: 3.00,
              totalPrice: 3.00,
              menuItemId: menuItems[7].id,
            },
          ],
        },
      },
    }),
    db.order.create({
      data: {
        orderNumber: 'CMD-002',
        status: 'PREPARING',
        subtotal: 38.50,
        tax: 7.70,
        tip: 0.00,
        total: 46.20,
        paymentMethod: 'CASH',
        paymentStatus: 'PENDING',
        tableId: tables[1].id,
        customerId: customers[1].id,
        employeeId: employees[1].id,
        restaurantId: restaurant.id,
        orderItems: {
          create: [
            {
              quantity: 1,
              unitPrice: 8.50,
              totalPrice: 8.50,
              menuItemId: menuItems[1].id,
            },
            {
              quantity: 1,
              unitPrice: 22.00,
              totalPrice: 22.00,
              menuItemId: menuItems[3].id,
            },
            {
              quantity: 1,
              unitPrice: 8.00,
              totalPrice: 8.00,
              menuItemId: menuItems[6].id,
            },
          ],
        },
      },
    }),
  ])

  console.log('✅ Orders created')

  // Create sample reservations
  const reservations = await Promise.all([
    db.reservation.create({
      data: {
        customerName: 'Réservation Test',
        customerPhone: '06 12 34 56 78',
        customerEmail: 'reservation@test.fr',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000), // Tomorrow 7pm
        partySize: 4,
        status: 'CONFIRMED',
        tableId: tables[2].id,
        customerId: customers[0].id,
      },
    }),
    db.reservation.create({
      data: {
        customerName: 'Famille Martin',
        customerPhone: '06 23 45 67 89',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000), // Day after tomorrow 8pm
        partySize: 6,
        status: 'PENDING',
        tableId: tables[3].id,
        customerId: customers[1].id,
      },
    }),
  ])

  console.log('✅ Reservations created')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })