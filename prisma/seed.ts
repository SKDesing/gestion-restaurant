import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('🌱 Début du peuplement de la base de données...');

  try {
    // Nettoyer la base de données existante
    console.log('🧹 Nettoyage de la base de données...');
    await prisma.alert.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.workSchedule.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.purchaseItem.deleteMany();
    await prisma.purchase.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.inventoryIngredient.deleteMany();
    await prisma.inventoryItem.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();
    await prisma.table.deleteMany();
    await prisma.restaurant.deleteMany();
    console.log('✅ Base de données nettoyée');
    // 1. Créer le restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        name: 'Le Gourmet Moderne',
        address: '123 Rue de la Gastronomie, 75001 Paris',
        phone: '+33 1 42 86 43 21',
        email: 'contact@legourmetmoderne.fr',
        description: 'Restaurant gastronomique moderne avec une cuisine innovante',
      },
    });
    console.log('✅ Restaurant créé:', restaurant.name);

    // 2. Créer les catégories de menu
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Entrées',
          description: 'Nos entrées raffinées',
          icon: '🥗',
          displayOrder: 1,
          restaurantId: restaurant.id,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Plats Principaux',
          description: 'Nos créations signature',
          icon: '🍽️',
          displayOrder: 2,
          restaurantId: restaurant.id,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Desserts',
          description: 'Desserts artisanaux',
          icon: '🍰',
          displayOrder: 3,
          restaurantId: restaurant.id,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Boissons',
          description: 'Sélection de boissons',
          icon: '🍷',
          displayOrder: 4,
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Catégories créées');

    // 3. Créer les tables du restaurant
    const tables = await Promise.all([
      // Terrasse (4 tables)
      ...Array.from({ length: 4 }, (_, i) => ({
        number: `T${i + 1}`,
        capacity: 2,
        status: 'AVAILABLE' as const,
        location: 'Terrasse',
        restaurantId: restaurant.id,
      })),
      // Salle Principale (6 tables)
      ...Array.from({ length: 4 }, (_, i) => ({
        number: `T${i + 5}`,
        capacity: 4,
        status: 'AVAILABLE' as const,
        location: 'Salle Principale',
        restaurantId: restaurant.id,
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        number: `T${i + 9}`,
        capacity: 6,
        status: 'AVAILABLE' as const,
        location: 'Salle Principale',
        restaurantId: restaurant.id,
      })),
      // Privé (2 tables)
      ...Array.from({ length: 2 }, (_, i) => ({
        number: `T${i + 11}`,
        capacity: 8,
        status: 'AVAILABLE' as const,
        location: 'Privé',
        restaurantId: restaurant.id,
      })),
    ].map(table => prisma.table.create({ data: table })));
    console.log('✅ Tables créées');

    // 4. Créer les employés
    const employees = await Promise.all([
      // Personnel de cuisine
      prisma.employee.create({
        data: {
          name: 'Pierre Dubois',
          email: 'pierre.chef@legourmetmoderne.fr',
          phone: '+33 6 12 34 56 78',
          role: 'CHEF',
          salary: 3500,
          hireDate: new Date('2023-01-15'),
          status: 'ACTIVE',
          restaurantId: restaurant.id,
        },
      }),
      prisma.employee.create({
        data: {
          name: 'Marie Martin',
          email: 'marie.souschef@legourmetmoderne.fr',
          phone: '+33 6 23 45 67 89',
          role: 'COOK',
          salary: 2800,
          hireDate: new Date('2023-03-20'),
          status: 'ACTIVE',
          restaurantId: restaurant.id,
        },
      }),
      prisma.employee.create({
        data: {
          name: 'Luc Bernard',
          email: 'luc.pcook@legourmetmoderne.fr',
          phone: '+33 6 34 56 78 90',
          role: 'COOK',
          salary: 2200,
          hireDate: new Date('2023-06-10'),
          status: 'ACTIVE',
          restaurantId: restaurant.id,
        },
      }),
      // Personnel de service
      prisma.employee.create({
        data: {
          name: 'Sophie Laurent',
          email: 'sophie.serveur@legourmetmoderne.fr',
          phone: '+33 6 45 67 89 01',
          role: 'WAITER',
          salary: 2100,
          hireDate: new Date('2023-02-01'),
          status: 'ACTIVE',
          restaurantId: restaurant.id,
        },
      }),
      prisma.employee.create({
        data: {
          name: 'Jean Petit',
          email: 'jean.serveur@legourmetmoderne.fr',
          phone: '+33 6 56 78 90 12',
          role: 'WAITER',
          salary: 2100,
          hireDate: new Date('2023-04-15'),
          status: 'ACTIVE',
          restaurantId: restaurant.id,
        },
      }),
      prisma.employee.create({
        data: {
          name: 'Claire Roux',
          email: 'claire.barmaid@legourmetmoderne.fr',
          phone: '+33 6 67 89 01 23',
          role: 'BARTENDER',
          salary: 2300,
          hireDate: new Date('2023-05-20'),
          status: 'ACTIVE',
          restaurantId: restaurant.id,
        },
      }),
      // Administration
      prisma.employee.create({
        data: {
          name: 'Michel Gauthier',
          email: 'michel.manager@legourmetmoderne.fr',
          phone: '+33 6 78 90 12 34',
          role: 'MANAGER',
          salary: 3800,
          hireDate: new Date('2022-09-01'),
          status: 'ACTIVE',
          restaurantId: restaurant.id,
        },
      }),
      prisma.employee.create({
        data: {
          name: 'Isabelle Bonnet',
          email: 'isabelle.cashier@legourmetmoderne.fr',
          phone: '+33 6 89 01 23 45',
          role: 'CASHIER',
          salary: 2000,
          hireDate: new Date('2023-07-10'),
          status: 'ACTIVE',
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Employés créés');

    // 5. Créer les stations de cuisine
    const kitchenStations = await Promise.all([
      prisma.kitchenStation.create({
        data: {
          name: 'Station Froide',
          description: 'Préparation des entrées froides',
          type: 'COLD_STARTER',
          status: 'ACTIVE',
          capacity: 2,
          restaurantId: restaurant.id,
        },
      }),
      prisma.kitchenStation.create({
        data: {
          name: 'Station Chaud',
          description: 'Plats principaux chauds',
          type: 'MAIN_COURSE',
          status: 'ACTIVE',
          capacity: 3,
          restaurantId: restaurant.id,
        },
      }),
      prisma.kitchenStation.create({
        data: {
          name: 'Grill',
          description: 'Grill et viandes',
          type: 'GRILL',
          status: 'ACTIVE',
          capacity: 2,
          restaurantId: restaurant.id,
        },
      }),
      prisma.kitchenStation.create({
        data: {
          name: 'Pâtisserie',
          description: 'Préparation des desserts',
          type: 'DESSERT',
          status: 'ACTIVE',
          capacity: 1,
          restaurantId: restaurant.id,
        },
      }),
      prisma.kitchenStation.create({
        data: {
          name: 'Bar',
          description: 'Préparation des boissons',
          type: 'BAR',
          status: 'ACTIVE',
          capacity: 2,
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Stations de cuisine créées');

    // 6. Créer les fournisseurs
    const suppliers = await Promise.all([
      prisma.supplier.create({
        data: {
          name: 'Terroir Frais',
          contactPerson: 'Jean-Marc Terrieur',
          email: 'contact@terroirfrais.fr',
          phone: '+33 1 40 12 34 56',
          address: '15 Rue du Marché, 75001 Paris',
          category: 'Légumes et Fruits',
          restaurantId: restaurant.id,
        },
      }),
      prisma.supplier.create({
        data: {
          name: 'Boucherie de Paris',
          contactPerson: 'Robert Boucher',
          email: 'commandes@boucheriedeparis.fr',
          phone: '+33 1 42 34 56 78',
          address: '8 Rue de la Boucherie, 75001 Paris',
          category: 'Viandes',
          restaurantId: restaurant.id,
        },
      }),
      prisma.supplier.create({
        data: {
          name: 'Poissonnerie Marine',
          contactPerson: 'Marin Pêcheur',
          email: 'poissons@poissonneriemarine.fr',
          phone: '+33 1 45 67 89 01',
          address: '23 Quai de la Seine, 75001 Paris',
          category: 'Produits de la mer',
          restaurantId: restaurant.id,
        },
      }),
      prisma.supplier.create({
        data: {
          name: 'Cave des Vins',
          contactPerson: 'Antoine Sommelier',
          email: 'vins@cavedesvins.fr',
          phone: '+33 1 56 78 90 12',
          address: '5 Rue des Vignerons, 75001 Paris',
          category: 'Boissons',
          restaurantId: restaurant.id,
        },
      }),
      prisma.supplier.create({
        data: {
          name: 'Épicerie Fine',
          contactPerson: 'Catherine Épicier',
          email: 'contact@epiceriefine.fr',
          phone: '+33 1 67 89 01 23',
          address: '12 Rue des Épices, 75001 Paris',
          category: 'Épicerie',
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Fournisseurs créés');

    // 7. Créer les catégories de boissons
    const beverageCategories = await Promise.all([
      prisma.beverageCategory.create({
        data: {
          name: 'Vins Rouges',
          description: 'Sélection de vins rouges',
          type: 'ALCOHOLIC',
          displayOrder: 1,
          restaurantId: restaurant.id,
        },
      }),
      prisma.beverageCategory.create({
        data: {
          name: 'Vins Blancs',
          description: 'Sélection de vins blancs',
          type: 'ALCOHOLIC',
          displayOrder: 2,
          restaurantId: restaurant.id,
        },
      }),
      prisma.beverageCategory.create({
        data: {
          name: 'Champagnes',
          description: 'Champagnes et bulles',
          type: 'ALCOHOLIC',
          displayOrder: 3,
          restaurantId: restaurant.id,
        },
      }),
      prisma.beverageCategory.create({
        data: {
          name: 'Cocktails',
          description: 'Cocktails maison',
          type: 'MIXED',
          displayOrder: 4,
          restaurantId: restaurant.id,
        },
      }),
      prisma.beverageCategory.create({
        data: {
          name: 'Boissons Chaudes',
          description: 'Cafés, thés et chocolats',
          type: 'HOT',
          displayOrder: 5,
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Catégories de boissons créées');

    // 8. Créer les boissons
    const beverages = await Promise.all([
      // Vins Rouges
      prisma.beverage.create({
        data: {
          name: 'Bordeaux Supérieur',
          description: 'Vin rouge corsé du Bordeaux',
          brand: 'Château Grand Vin',
          origin: 'Bordeaux, France',
          vintage: '2020',
          abv: 13.5,
          volume: 750,
          price: 45.0,
          cost: 18.0,
          category: 'Vins Rouges',
          servingGlass: 'Verre à vin rouge',
          available: true,
          ageRestriction: true,
          categoryId: beverageCategories[0].id,
          supplierId: suppliers[3].id,
          restaurantId: restaurant.id,
        },
      }),
      prisma.beverage.create({
        data: {
          name: 'Bourgogne Pinot Noir',
          description: 'Pinot noir élégant de Bourgogne',
          brand: 'Domaine Bourguignon',
          origin: 'Bourgogne, France',
          vintage: '2021',
          abv: 12.5,
          volume: 750,
          price: 52.0,
          cost: 22.0,
          category: 'Vins Rouges',
          servingGlass: 'Verre à vin rouge',
          available: true,
          ageRestriction: true,
          categoryId: beverageCategories[0].id,
          supplierId: suppliers[3].id,
          restaurantId: restaurant.id,
        },
      }),
      // Vins Blancs
      prisma.beverage.create({
        data: {
          name: 'Sauvignon de Touraine',
          description: 'Vin blanc frais et fruité',
          brand: 'Domaine Loire',
          origin: 'Vallée de la Loire, France',
          vintage: '2023',
          abv: 11.5,
          volume: 750,
          price: 28.0,
          cost: 12.0,
          category: 'Vins Blancs',
          servingGlass: 'Verre à vin blanc',
          available: true,
          ageRestriction: true,
          categoryId: beverageCategories[1].id,
          supplierId: suppliers[3].id,
          restaurantId: restaurant.id,
        },
      }),
      // Champagnes
      prisma.beverage.create({
        data: {
          name: 'Champagne Brut',
          description: 'Champagne brut élégant',
          brand: 'Maison Champagne',
          origin: 'Champagne, France',
          vintage: 'NV',
          abv: 12.0,
          volume: 750,
          price: 65.0,
          cost: 28.0,
          category: 'Champagnes',
          servingGlass: 'Flûte à champagne',
          available: true,
          ageRestriction: true,
          categoryId: beverageCategories[2].id,
          supplierId: suppliers[3].id,
          restaurantId: restaurant.id,
        },
      }),
      // Cocktails
      prisma.beverage.create({
        data: {
          name: 'Mojito Maison',
          description: 'Mojito frais avec menthe bio',
          volume: 200,
          price: 12.0,
          cost: 4.5,
          category: 'Cocktails',
          servingGlass: 'Verre highball',
          garnish: 'Feuille de menthe et quartier de citron vert',
          preparationMethod: 'Pilé, mélangé avec glace',
          available: true,
          ageRestriction: true,
          categoryId: beverageCategories[3].id,
          restaurantId: restaurant.id,
        },
      }),
      // Boissons chaudes
      prisma.beverage.create({
        data: {
          name: 'Café Expresso',
          description: 'Café espresso italien',
          brand: 'Caffè Italiano',
          volume: 40,
          price: 3.0,
          cost: 0.8,
          category: 'Boissons Chaudes',
          servingGlass: 'Tasse à expresso',
          available: true,
          categoryId: beverageCategories[4].id,
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Boissons créées');

    // 9. Créer les catégories de denrées
    const foodCategories = await Promise.all([
      prisma.foodCategory.create({
        data: {
          name: 'Légumes Frais',
          description: 'Légumes de saison',
          storageType: 'REFRIGERATED',
          temperatureRange: '2-4°C',
          shelfLife: 7,
          allergens: '',
          restaurantId: restaurant.id,
        },
      }),
      prisma.foodCategory.create({
        data: {
          name: 'Viandes',
          description: 'Viandes fraîches',
          storageType: 'REFRIGERATED',
          temperatureRange: '0-4°C',
          shelfLife: 5,
          allergens: '',
          restaurantId: restaurant.id,
        },
      }),
      prisma.foodCategory.create({
        data: {
          name: 'Produits de la mer',
          description: 'Poissons et fruits de mer',
          storageType: 'REFRIGERATED',
          temperatureRange: '0-2°C',
          shelfLife: 3,
          allergens: 'Poissons, crustacés',
          restaurantId: restaurant.id,
        },
      }),
      prisma.foodCategory.create({
        data: {
          name: 'Produits secs',
          description: 'Pâtes, riz, farines',
          storageType: 'AMBIENT',
          temperatureRange: 'Ambient',
          shelfLife: 365,
          allergens: 'Gluten',
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Catégories de denrées créées');

    // 10. Créer les denrées alimentaires
    const foodItems = await Promise.all([
      // Légumes
      prisma.foodItem.create({
        data: {
          name: 'Tomates Coeur de Boeuf',
          description: 'Tomates charnues et parfumées',
          brand: 'Terroir Frais',
          category: 'Légumes Frais',
          unit: 'kg',
          weight: 1000,
          calories: 18,
          proteins: 0.9,
          carbs: 3.9,
          fats: 0.2,
          fiber: 1.2,
          sodium: 0.005,
          origin: 'France',
          certification: 'Bio',
          categoryId: foodCategories[0].id,
          supplierId: suppliers[0].id,
          restaurantId: restaurant.id,
        },
      }),
      prisma.foodItem.create({
        data: {
          name: 'Salade Verte',
          description: 'Jeunes pousses de salade',
          brand: 'Terroir Frais',
          category: 'Légumes Frais',
          unit: 'kg',
          weight: 1000,
          calories: 15,
          proteins: 1.4,
          carbs: 2.9,
          fats: 0.2,
          fiber: 2.5,
          origin: 'France',
          categoryId: foodCategories[0].id,
          supplierId: suppliers[0].id,
          restaurantId: restaurant.id,
        },
      }),
      // Viandes
      prisma.foodItem.create({
        data: {
          name: 'Filet de Boeuf',
          description: 'Filet de boeuf premium',
          brand: 'Boucherie de Paris',
          category: 'Viandes',
          unit: 'kg',
          weight: 1000,
          calories: 250,
          proteins: 26,
          carbs: 0,
          fats: 15,
          origin: 'France',
          categoryId: foodCategories[1].id,
          supplierId: suppliers[1].id,
          restaurantId: restaurant.id,
        },
      }),
      prisma.foodItem.create({
        data: {
          name: 'Magret de Canard',
          description: 'Magret de canard gras',
          brand: 'Boucherie de Paris',
          category: 'Viandes',
          unit: 'kg',
          weight: 1000,
          calories: 337,
          proteins: 24,
          carbs: 0,
          fats: 28,
          origin: 'France',
          categoryId: foodCategories[1].id,
          supplierId: suppliers[1].id,
          restaurantId: restaurant.id,
        },
      }),
      // Produits de la mer
      prisma.foodItem.create({
        data: {
          name: 'Saumon Écossais',
          description: 'Filet de saumon frais',
          brand: 'Poissonnerie Marine',
          category: 'Produits de la mer',
          unit: 'kg',
          weight: 1000,
          calories: 208,
          proteins: 20,
          carbs: 0,
          fats: 13,
          origin: 'Écosse',
          categoryId: foodCategories[2].id,
          supplierId: suppliers[2].id,
          restaurantId: restaurant.id,
        },
      }),
      // Produits secs
      prisma.foodItem.create({
        data: {
          name: 'Pâtes Penne',
          description: 'Pâtes de blé dur',
          brand: 'Pasta Italiana',
          category: 'Produits secs',
          unit: 'kg',
          weight: 1000,
          calories: 357,
          proteins: 13,
          carbs: 75,
          fats: 1.5,
          fiber: 3,
          origin: 'Italie',
          categoryId: foodCategories[3].id,
          supplierId: suppliers[4].id,
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Denrées alimentaires créées');

    // 11. Créer les items du menu
    const menuItems = await Promise.all([
      // Entrées
      prisma.menuItem.create({
        data: {
          name: 'Salade César',
          description: 'Salade romaine, poulet grillé, parmesan, croûtons',
          price: 14.0,
          cost: 4.5,
          category: 'Entrées',
          preparationTime: 10,
          calories: 320,
          vegetarian: false,
          glutenFree: false,
          available: true,
          categoryId: categories[0].id,
          restaurantId: restaurant.id,
        },
      }),
      prisma.menuItem.create({
        data: {
          name: 'Soupe à l\'oignon',
          description: 'Soupe traditionnelle française avec gruyère gratiné',
          price: 9.0,
          cost: 2.8,
          category: 'Entrées',
          preparationTime: 15,
          calories: 280,
          vegetarian: true,
          glutenFree: false,
          available: true,
          categoryId: categories[0].id,
          restaurantId: restaurant.id,
        },
      }),
      prisma.menuItem.create({
        data: {
          name: 'Tartare de saumon',
          description: 'Saumon frais mariné, avocat, citron vert',
          price: 16.0,
          cost: 6.2,
          category: 'Entrées',
          preparationTime: 12,
          calories: 290,
          vegetarian: false,
          glutenFree: true,
          available: true,
          categoryId: categories[0].id,
          restaurantId: restaurant.id,
        },
      }),
      // Plats principaux
      prisma.menuItem.create({
        data: {
          name: 'Filet de boeuf Rossini',
          description: 'Filet de boeuf, foie gras, sauce madère',
          price: 45.0,
          cost: 18.5,
          category: 'Plats Principaux',
          preparationTime: 25,
          calories: 680,
          vegetarian: false,
          glutenFree: false,
          available: true,
          categoryId: categories[1].id,
          restaurantId: restaurant.id,
        },
      }),
      prisma.menuItem.create({
        data: {
          name: 'Magret de canard',
          description: 'Magret grillé, sauce aux fruits rouges',
          price: 32.0,
          cost: 12.8,
          category: 'Plats Principaux',
          preparationTime: 20,
          calories: 520,
          vegetarian: false,
          glutenFree: true,
          available: true,
          categoryId: categories[1].id,
          restaurantId: restaurant.id,
        },
      }),
      prisma.menuItem.create({
        data: {
          name: 'Risotto aux champignons',
          description: 'Risotto crémeux aux champignons sauvages',
          price: 24.0,
          cost: 7.5,
          category: 'Plats Principaux',
          preparationTime: 18,
          calories: 420,
          vegetarian: true,
          glutenFree: false,
          available: true,
          categoryId: categories[1].id,
          restaurantId: restaurant.id,
        },
      }),
      prisma.menuItem.create({
        data: {
          name: 'Saumon en croûte',
          description: 'Saumon en croûte d\'herbes, purée de panais',
          price: 28.0,
          cost: 11.2,
          category: 'Plats Principaux',
          preparationTime: 22,
          calories: 480,
          vegetarian: false,
          glutenFree: false,
          available: true,
          categoryId: categories[1].id,
          restaurantId: restaurant.id,
        },
      }),
      // Desserts
      prisma.menuItem.create({
        data: {
          name: 'Tiramisu',
          description: 'Tiramisu classique italien',
          price: 9.0,
          cost: 3.2,
          category: 'Desserts',
          preparationTime: 5,
          calories: 380,
          vegetarian: true,
          glutenFree: false,
          available: true,
          categoryId: categories[2].id,
          restaurantId: restaurant.id,
        },
      }),
      prisma.menuItem.create({
        data: {
          name: 'Crème brûlée',
          description: 'Crème vanillée avec sucre caramélisé',
          price: 8.5,
          cost: 2.8,
          category: 'Desserts',
          preparationTime: 5,
          calories: 320,
          vegetarian: true,
          glutenFree: true,
          available: true,
          categoryId: categories[2].id,
          restaurantId: restaurant.id,
        },
      }),
      prisma.menuItem.create({
        data: {
          name: 'Fondant au chocolat',
          description: 'Fondant au chocolat noir, cœur coulant',
          price: 8.0,
          cost: 2.5,
          category: 'Desserts',
          preparationTime: 8,
          calories: 420,
          vegetarian: true,
          glutenFree: false,
          available: true,
          categoryId: categories[2].id,
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Items du menu créés');

    // 12. Créer les stocks initiaux
    const inventoryItems = await Promise.all([
      // Stocks de denrées
      prisma.inventoryItem.create({
        data: {
          name: 'Tomates Coeur de Boeuf',
          category: 'Légumes',
          unit: 'kg',
          currentStock: 15,
          minStock: 5,
          maxStock: 30,
          unitCost: 3.5,
          restaurantId: restaurant.id,
        },
      }),
      prisma.inventoryItem.create({
        data: {
          name: 'Filet de Boeuf',
          category: 'Viandes',
          unit: 'kg',
          currentStock: 8,
          minStock: 3,
          maxStock: 20,
          unitCost: 25.0,
          restaurantId: restaurant.id,
        },
      }),
      prisma.inventoryItem.create({
        data: {
          name: 'Saumon Écossais',
          category: 'Poissons',
          unit: 'kg',
          currentStock: 6,
          minStock: 2,
          maxStock: 15,
          unitCost: 18.0,
          restaurantId: restaurant.id,
        },
      }),
      prisma.inventoryItem.create({
        data: {
          name: 'Farine',
          category: 'Produits secs',
          unit: 'kg',
          currentStock: 25,
          minStock: 10,
          maxStock: 50,
          unitCost: 1.2,
          restaurantId: restaurant.id,
        },
      }),
      prisma.inventoryItem.create({
        data: {
          name: 'Huile d\'olive',
          category: 'Produits secs',
          unit: 'L',
          currentStock: 12,
          minStock: 3,
          maxStock: 20,
          unitCost: 8.5,
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Stocks initiaux créés');

    // 13. Créer les stocks de boissons
    const beverageStocks = await Promise.all([
      prisma.beverageStock.create({
        data: {
          beverageId: beverages[0].id, // Bordeaux
          quantity: 24,
          unit: 'bouteilles',
          location: 'Cave',
          minStock: 6,
          maxStock: 48,
          restaurantId: restaurant.id,
        },
      }),
      prisma.beverageStock.create({
        data: {
          beverageId: beverages[1].id, // Bourgogne
          quantity: 18,
          unit: 'bouteilles',
          location: 'Cave',
          minStock: 6,
          maxStock: 36,
          restaurantId: restaurant.id,
        },
      }),
      prisma.beverageStock.create({
        data: {
          beverageId: beverages[4].id, // Mojito
          quantity: 5,
          unit: 'L',
          location: 'Bar',
          minStock: 2,
          maxStock: 10,
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Stocks de boissons créés');

    // 14. Créer les équipements
    const equipmentCategories = await Promise.all([
      prisma.equipmentCategory.create({
        data: {
          name: 'Équipements de Cuisson',
          description: 'Fours, plaques, etc.',
          maintenanceFrequency: 'MONTHLY',
          expectedLifespan: 120,
          restaurantId: restaurant.id,
        },
      }),
      prisma.equipmentCategory.create({
        data: {
          name: 'Réfrigération',
          description: 'Frigos, congélateurs',
          maintenanceFrequency: 'WEEKLY',
          expectedLifespan: 180,
          restaurantId: restaurant.id,
        },
      }),
    ]);

    const equipment = await Promise.all([
      prisma.equipment.create({
        data: {
          name: 'Four à convection',
          description: 'Four professionnel 6 niveaux',
          brand: 'BakeMaster',
          model: 'BM-6000',
          serialNumber: 'BM6000-2023-001',
          category: 'Équipements de Cuisson',
          location: 'Cuisine',
          purchaseDate: new Date('2023-01-15'),
          purchasePrice: 4500,
          warrantyExpiry: new Date('2025-01-15'),
          status: 'OPERATIONAL',
          capacity: '6 niveaux',
          dimensions: '120x80x200cm',
          weight: 150,
          categoryId: equipmentCategories[0].id,
          restaurantId: restaurant.id,
        },
      }),
      prisma.equipment.create({
        data: {
          name: 'Frigo positif',
          description: 'Réfrigérateur professionnel',
          brand: 'CoolPro',
          model: 'CP-800',
          serialNumber: 'CP800-2023-002',
          category: 'Réfrigération',
          location: 'Cuisine',
          purchaseDate: new Date('2023-02-20'),
          purchasePrice: 2800,
          warrantyExpiry: new Date('2026-02-20'),
          status: 'OPERATIONAL',
          capacity: '800L',
          dimensions: '80x70x200cm',
          weight: 120,
          categoryId: equipmentCategories[1].id,
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Équipements créés');

    // 15. Créer quelques clients
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          name: 'Dupont Jean',
          email: 'jean.dupont@email.com',
          phone: '+33 6 12 34 56 78',
          loyaltyPoints: 150,
        },
      }),
      prisma.customer.create({
        data: {
          name: 'Martin Sophie',
          email: 'sophie.martin@email.com',
          phone: '+33 6 23 45 67 89',
          loyaltyPoints: 280,
        },
      }),
      prisma.customer.create({
        data: {
          name: 'Bernard Pierre',
          email: 'pierre.bernard@email.com',
          phone: '+33 6 34 56 78 90',
          loyaltyPoints: 75,
        },
      }),
    ]);
    console.log('✅ Clients créés');

    // 16. Créer quelques commandes d'exemple
    const orders = await Promise.all([
      prisma.order.create({
        data: {
          orderNumber: 'CMD-2024-001',
          status: 'COMPLETED',
          type: 'DINE_IN',
          subtotal: 89.0,
          tax: 17.8,
          tip: 8.9,
          total: 115.7,
          paymentMethod: 'CARD',
          paymentStatus: 'PAID',
          tableId: tables[0].id,
          customerId: customers[0].id,
          employeeId: employees[3].id,
          priority: 'NORMAL',
          createdAt: new Date('2024-01-15T19:30:00Z'),
          updatedAt: new Date('2024-01-15T21:45:00Z'),
          restaurantId: restaurant.id,
        },
      }),
      prisma.order.create({
        data: {
          orderNumber: 'CMD-2024-002',
          status: 'COMPLETED',
          type: 'DINE_IN',
          subtotal: 124.0,
          tax: 24.8,
          tip: 12.4,
          total: 161.2,
          paymentMethod: 'CARD',
          paymentStatus: 'PAID',
          tableId: tables[2].id,
          customerId: customers[1].id,
          employeeId: employees[4].id,
          priority: 'NORMAL',
          createdAt: new Date('2024-01-15T20:15:00Z'),
          updatedAt: new Date('2024-01-15T22:30:00Z'),
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Commandes créées');

    // 17. Ajouter les items de commande
    await Promise.all([
      // Items pour la première commande
      prisma.orderItem.create({
        data: {
          quantity: 1,
          unitPrice: 14.0,
          totalPrice: 14.0,
          orderId: orders[0].id,
          menuItemId: menuItems[0].id, // Salade César
        },
      }),
      prisma.orderItem.create({
        data: {
          quantity: 1,
          unitPrice: 45.0,
          totalPrice: 45.0,
          orderId: orders[0].id,
          menuItemId: menuItems[3].id, // Filet de boeuf
        },
      }),
      prisma.orderItem.create({
        data: {
          quantity: 1,
          unitPrice: 8.5,
          totalPrice: 8.5,
          orderId: orders[0].id,
          menuItemId: menuItems[7].id, // Crème brûlée
        },
      }),
      prisma.orderItem.create({
        data: {
          quantity: 2,
          unitPrice: 45.0,
          totalPrice: 90.0,
          orderId: orders[1].id,
          menuItemId: menuItems[3].id, // Filet de boeuf
        },
      }),
      prisma.orderItem.create({
        data: {
          quantity: 1,
          unitPrice: 9.0,
          totalPrice: 9.0,
          orderId: orders[1].id,
          menuItemId: menuItems[8].id, // Tiramisu
        },
      }),
    ]);
    console.log('✅ Items de commande créés');

    // 18. Créer les comptes bancaires
    const bankAccounts = await Promise.all([
      prisma.bankAccount.create({
        data: {
          bankName: 'BNP Paribas',
          accountNumber: 'FR7630004000031234567890143',
          accountType: 'BUSINESS',
          balance: 15420.50,
          currency: 'EUR',
          iban: 'FR7630004000031234567890143',
          bic: 'BNPAFRPP',
          status: 'ACTIVE',
          restaurantId: restaurant.id,
        },
      }),
      prisma.bankAccount.create({
        data: {
          bankName: 'Société Générale',
          accountNumber: 'FR7630004000039876543210123',
          accountType: 'CHECKING',
          balance: 8750.25,
          currency: 'EUR',
          iban: 'FR7630004000039876543210123',
          bic: 'SOGEFRPP',
          status: 'ACTIVE',
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Comptes bancaires créés');

    // 19. Créer quelques transactions
    await Promise.all([
      prisma.transaction.create({
        data: {
          reference: 'TRX-2024-001',
          type: 'INCOME',
          category: 'SALES_REVENUE',
          amount: 115.7,
          description: 'Vente restaurant CMD-2024-001',
          date: new Date('2024-01-15T21:45:00Z'),
          accountId: bankAccounts[0].id,
          orderId: orders[0].id,
          paymentMethod: 'CARD',
          restaurantId: restaurant.id,
        },
      }),
      prisma.transaction.create({
        data: {
          reference: 'TRX-2024-002',
          type: 'INCOME',
          category: 'SALES_REVENUE',
          amount: 161.2,
          description: 'Vente restaurant CMD-2024-002',
          date: new Date('2024-01-15T22:30:00Z'),
          accountId: bankAccounts[0].id,
          orderId: orders[1].id,
          paymentMethod: 'CARD',
          restaurantId: restaurant.id,
        },
      }),
      prisma.transaction.create({
        data: {
          reference: 'TRX-2024-003',
          type: 'EXPENSE',
          category: 'FOOD_PURCHASE',
          amount: 450.0,
          description: 'Achat légumes et viandes',
          date: new Date('2024-01-14T10:00:00Z'),
          accountId: bankAccounts[1].id,
          supplierId: suppliers[0].id,
          restaurantId: restaurant.id,
        },
      }),
    ]);
    console.log('✅ Transactions créées');

    console.log('\n🎉 Base de données peuplée avec succès !');
    console.log('\n📊 Résumé:');
    console.log(`- Restaurant: ${restaurant.name}`);
    console.log(`- Tables: ${tables.length}`);
    console.log(`- Employés: ${employees.length}`);
    console.log(`- Catégories menu: ${categories.length}`);
    console.log(`- Items menu: ${menuItems.length}`);
    console.log(`- Boissons: ${beverages.length}`);
    console.log(`- Denrées: ${foodItems.length}`);
    console.log(`- Fournisseurs: ${suppliers.length}`);
    console.log(`- Équipements: ${equipment.length}`);
    console.log(`- Clients: ${customers.length}`);
    console.log(`- Commandes: ${orders.length}`);
    console.log(`- Comptes bancaires: ${bankAccounts.length}`);

  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
seedDatabase()
  .then(() => {
    console.log('\n✨ Peuplement terminé avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erreur fatale:', error);
    process.exit(1);
  });