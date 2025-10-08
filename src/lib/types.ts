export type Role = 'Administrateur' | 'Technicien' | 'Agent de support';

export type Status = 'En attente' | 'En cours' | 'Clôturée';

export type Category = 'Pannes' | 'Branchements' | 'Relevés' | 'Maintenance' | 'Autre';

export type Priority = 'Normale' | 'Urgente';

export type Region = 'Tunis' | 'Sfax' | 'Sousse' | 'Ariana' | 'Ben Arous' | 'Nabeul';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  password?: string;
};

export type Intervention = {
  id: string;
  clientName: string;
  address: string;
  region: Region;
  category: Category;
  status: Status;
  priority: Priority;
  assignedTo: string; // User ID
  date: string;
  lastUpdated: string;
  notes: string;
  summary?: string;
};
