const database = require('./database');

/**
 * Persistence layer for patients
 *
 * This class is responsible for mapping between the string type of the patient's id
 * in the patient model and the internal integer representation in the database.
 */

/**
 * @returns { Patient[] } Array of all patients
 */
exports.getAll = async () => {
  const db = database.getDatabase();
  let rows = await db.all('SELECT id, first_name, last_name, birth_date, civic_address, municipality, province, postal_code FROM patients');
  return rows.map(row => {
    return {
      id: '' + row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      birthDate: row.birth_date,
      civicAddress: row.civic_address,
      municipality: row.municipality,
      province: row.province,
      postalCode: row.postal_code
    };
  });
};

/**
 * @param { string } id Patient's unique ID
 * @returns { Patient } Patient object
 */
exports.get = async (id) => {
  const db = database.getDatabase();
  let row = await db.get('SELECT id, first_name, last_name, birth_date, civic_address, municipality, province, postal_code FROM patients WHERE id = $id', { $id: +id });
  if (!row) {
    return null;
  }
  return {
    id: '' + row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    birthDate: row.birth_date,
    civicAddress: row.civic_address,
    municipality: row.municipality,
    province: row.province,
    postalCode: row.postal_code
  };
};

/**
 * @param { string } id Patient's unique ID
 */
exports.delete = async (id) => {
  const db = database.getDatabase();
  let result = await db.run('DELETE FROM patients WHERE id = $id', { $id: +id });
  if (!result.changes) {
    throw new Error(`Patient with id '${id}' does not exist`);
  }
};

/**
 * @param { Patient } patient Patient to create
 * @returns { Patient } Created patient object with id set
 */
exports.create = async (patient) => {
  const db = database.getDatabase();
  let result = await db.run(
    'INSERT INTO patients (first_name, last_name, birth_date, civic_address, municipality, province, postal_code) VALUES ($firstName, $lastName, $birthDate, $civicAddress, $municipality, $province, $postalCode)',
    { $firstName: patient.firstName, $lastName: patient.lastName, $birthDate: patient.birthDate, $civicAddress: patient.civicAddress, $municipality: patient.municipality, $province: patient.province, $postalCode: patient.postalCode }
  );
  if (!result.lastID) {
    throw new Error('Failed to create patient');
  }
  patient.id = '' + result.lastID;
  return patient;
};

/**
 * @param { Patient } patient Patient to update based upon patient's id
 * @returns { Patient } Updated patient object
 */
exports.update = async (patient) => {
  const db = database.getDatabase();
  let result = await db.run(`
    UPDATE patients
    SET first_name = $firstName, last_name = $lastName, birth_date = $birthDate, civic_address = $civicAddress, municipality = $municipality, province = $province, postal_code = $postalCode
    WHERE id = $id
  `, { $firstName: patient.firstName, $lastName: patient.lastName, $birthDate: patient.birthDate, $id: +patient.id, $civicAddress: patient.civicAddress, $municipality: patient.municipality, $postalCode: patient.postalCode });
  if (!result.changes) {
    throw new Error(`Failed to update patient with id '${patient.id}'`);
  }
  return patient;
};
