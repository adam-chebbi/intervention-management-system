import type { Intervention, User } from './types';

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(',', ''); // remove comma from date format
};

const escapeCsvField = (field: string | undefined) => {
    if (field === undefined || field === null) return '';
    const stringField = String(field);
    // If the field contains a comma, double quote, or newline, wrap it in double quotes.
    if (/[",\n]/.test(stringField)) {
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
};

export const generateInterventionsCSV = (
  interventions: Intervention[],
  users: User[],
  statusFilter: string
) => {
  const usersMap = new Map(users.map(user => [user.id, user.name]));

  const headers = [
    "ID", "Nom du Client", "Adresse", "Région", "Catégorie", "Priorité", 
    "Statut", "Technicien Assigné", "Date de Création", "Dernière Mise à Jour", "Notes"
  ];
  
  const csvRows = [headers.join(',')];

  interventions.forEach(inter => {
    const row = [
      escapeCsvField(inter.id),
      escapeCsvField(inter.clientName),
      escapeCsvField(inter.address),
      escapeCsvField(inter.region),
      escapeCsvField(inter.category),
      escapeCsvField(inter.priority),
      escapeCsvField(inter.status),
      escapeCsvField(usersMap.get(inter.assignedTo) || 'Non assigné'),
      escapeCsvField(formatDate(inter.date)),
      escapeCsvField(formatDate(inter.lastUpdated)),
      escapeCsvField(inter.notes),
    ];
    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];
    const filename = `interventions_${statusFilter}_${date}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
