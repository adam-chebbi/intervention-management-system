// tsx src/scripts/seed.ts
import admin from 'firebase-admin';
import bcrypt from 'bcryptjs';
import type { User, Intervention, Role, Status, Category, Priority, Region } from '../lib/types';
import { Faker, fr } from '@faker-js/faker';

const faker = new Faker({
  locale: [fr],
});


// IMPORTANT: Path to your Firebase service account key JSON file.
// You must download this from your Firebase project settings.
const serviceAccount = require('../../steg-dd37d-firebase-adminsdk-fbsvc-433513cc50d5b9583a83c15def6087b6115b048d.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const DEFAULT_PASSWORD = 'tunisie';

// Tunisian data for seeding
const tunisianMaleNames = ['Mohamed Ali', 'Ahmed', 'Youssef', 'Karim', 'Hichem', 'Sami', 'Khaled', 'Skander', 'Anis', 'Zied'];
const tunisianLastNames = ['Ben Ali', 'Trabelsi', 'Gharbi', 'Bouazizi', 'Haddad', 'Chebbi', 'Jaziri', 'Maaloul', 'Abidi'];
const tunisianCompanies = ['Poulina Group Holding', 'SOTIPAPIER', 'Délice Danone', 'Tunisie Telecom', 'Ooredoo Tunisie', 'Groupe Mabrouk'];
const regions: Region[] = ['Tunis', 'Sfax', 'Sousse', 'Ariana', 'Ben Arous', 'Nabeul'];
const interventionNotes = [
    'Le compteur principal semble défectueux, il ne tourne plus.',
    'Demande de nouveau branchement pour une nouvelle construction.',
    'Aucun courant dans tout le quartier, panne générale signalée.',
    'Relevé de compteur demandé suite à une contestation de facture.',
    'Maintenance préventive du transformateur de la zone industrielle.',
    'Câble électrique tombé à terre après la tempête, danger immédiat.',
    'Odeur de gaz suspecte près de la conduite principale.',
    'Contrôle de tension suite à des baisses de régime fréquentes.',
];

const usersToSeed: Omit<User, 'id' | 'avatar'>[] = [
    { name: 'Admin Principal', email: 'admin@mail.com.tn', role: 'Administrateur', password: DEFAULT_PASSWORD },
    { name: 'Amira Khelifi', email: 'amira.khelifi@mail.com.tn', role: 'Agent de support', password: DEFAULT_PASSWORD },
    { name: 'Youssef Ben Ali', email: 'youssef.benali@mail.com.tn', role: 'Technicien', password: DEFAULT_PASSWORD },
    { name: 'Karim Saidi', email: 'karim.saidi@mail.com.tn', role: 'Technicien', password: DEFAULT_PASSWORD },
    { name: 'Mohamed Slimani', email: 'mohamed.slimani@mail.com.tn', role: 'Technicien', password: DEFAULT_PASSWORD },
    { name: 'Aymen Trabelsi', email: 'aymen.trabelsi@mail.com.tn', role: 'Technicien', password: DEFAULT_PASSWORD },
];

const seedUsers = async () => {
    console.log('Seeding users...');
    const userIds: string[] = [];
    const batch = db.batch();

    for (const userData of usersToSeed) {
        // Find existing user by email
        const existingUserQuery = await db.collection('users').where('email', '==', userData.email).limit(1).get();
        if (!existingUserQuery.empty) {
            const userId = existingUserQuery.docs[0].id;
            userIds.push(userId);
            console.log(`- User already exists: ${userData.name}`);
            continue;
        }

        const userRef = db.collection('users').doc();
        const hashedPassword = await bcrypt.hash(userData.password!, 10);
        
        const newUser: Omit<User, 'avatar'> & {id: string, password?: string, avatar?: string} = {
            ...userData,
            id: userRef.id,
            password: hashedPassword,
        }
        delete newUser.avatar; // Ensure avatar is not set

        batch.set(userRef, newUser);
        userIds.push(userRef.id);
        console.log(`- Creating user: ${userData.name}`);
    }
    await batch.commit();
    console.log('Users seeding/verification complete!');
    return userIds;
};

const seedInterventions = async (technicianIds: string[]) => {
    console.log('Seeding interventions...');
    const categories: Category[] = ['Pannes', 'Branchements', 'Relevés', 'Maintenance', 'Autre'];
    const priorities: Priority[] = ['Normale', 'Urgente'];
    const statuses: Status[] = ['En attente', 'En cours', 'Clôturée'];
    const batch = db.batch();
    
    for (let i = 0; i < 30; i++) {
        const interventionRef = db.collection('interventions').doc(`INT-${(1001 + i).toString()}`);
        const status = faker.helpers.arrayElement(statuses);
        const assignedTo = status !== 'En attente' ? faker.helpers.arrayElement(technicianIds) : (faker.datatype.boolean() ? faker.helpers.arrayElement(technicianIds) : '');
        const date = faker.date.past({ years: 1 });
        const lastUpdated = faker.date.between({ from: date, to: new Date() });
        const region = faker.helpers.arrayElement(regions);

        const clientName = faker.datatype.boolean()
            ? faker.helpers.arrayElement(tunisianCompanies)
            : `${faker.helpers.arrayElement(tunisianMaleNames)} ${faker.helpers.arrayElement(tunisianLastNames)}`;

        const interventionData: Omit<Intervention, 'id'> = {
            clientName: clientName,
            address: `${faker.location.streetAddress(false)}, ${region}`,
            region: region,
            category: faker.helpers.arrayElement(categories),
            status: status,
            priority: faker.helpers.arrayElement(priorities),
            assignedTo: assignedTo,
            date: date.toISOString(),
            lastUpdated: lastUpdated.toISOString(),
            notes: faker.helpers.arrayElement(interventionNotes),
            summary: faker.lorem.sentence(),
        };

        batch.set(interventionRef, interventionData);
        console.log(`- Preparing intervention: ${interventionRef.id} for ${interventionData.clientName}`);
    }

    await batch.commit();
    console.log('Interventions seeded successfully!');
};


const seedDatabase = async () => {
    try {
        await seedUsers();
        const technicianDocs = await db.collection('users').where('role', '==', 'Technicien').get();
        const technicianIds = technicianDocs.docs.map(doc => doc.id);
        
        await seedInterventions(technicianIds);
        console.log('\nDatabase seeding complete!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

seedDatabase();
