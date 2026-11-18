require('dotenv').config();
const mongoose = require('mongoose'); const bcrypt = require('bcryptjs');
const [User, Department, Doctor, Appointment] = ['User', 'Department', 'Doctor', 'Appointment'].map((n) => require('./models/' + n));
const deps = [
  ['Cardiology', 'Heart', ['ECG & Echocardiography', 'Cardiac Rehabilitation', 'Hypertension Care'], 'Heart care from prevention to advanced treatment.'],
  ['Pediatrics', 'Baby', ['Child Wellness Checks', 'Vaccinations', 'Newborn Care'], 'Gentle, family-centered care for infants and children.'],
  ['Orthopedics', 'Bone', ['Joint Replacement', 'Sports Injury Care', 'Fracture Treatment'], 'Restoring movement for bones, joints and muscles.'],
  ['Neurology', 'Brain', ['Stroke Care', 'Epilepsy Management', 'Headache Clinic'], 'Diagnosis and treatment of brain and nerve conditions.'],
  ['Dermatology', 'Sparkles', ['Skin Cancer Screening', 'Acne & Eczema Care', 'Laser Treatments'], 'Medical and cosmetic skin care.'],
  ['Emergency Care', 'Siren', ['24/7 Trauma Team', 'Rapid Triage', 'Ambulance Services'], 'Round-the-clock emergency response.'],
];
const docs = [['Dr. Sarah Mitchell', 0, 'Interventional Cardiologist', 'MD, FACC', 15], ['Dr. James Okafor', 0, 'Heart Failure Specialist', 'MD, PhD', 11],
  ['Dr. Emily Chen', 1, 'General Pediatrician', 'MD, FAAP', 9], ['Dr. Rahul Verma', 2, 'Orthopedic Surgeon', 'MD, MS Ortho', 18],
  ['Dr. Laila Haddad', 3, 'Neurologist', 'MD, DM Neurology', 13], ['Dr. Michael Torres', 4, 'Dermatologist', 'MD, FAAD', 8]];
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany({}), Department.deleteMany({}), Doctor.deleteMany({}), Appointment.deleteMany({})]);
  const D = await Department.insertMany(deps.map(([name, iconName, services, description]) => ({ name, iconName, services, description, slug: name.toLowerCase().replace(/\s+/g, '-') })));
  await Doctor.insertMany(docs.map(([name, d, specialty, qualifications, experienceYears], i) => ({
    name, specialty, qualifications, experienceYears, department: D[d]._id, email: `doctor${i + 1}@carefirst.test`,
    bio: `${name} is a dedicated ${specialty.toLowerCase()} at CareFirst General Hospital.`,
    availableDays: i % 2 ? ['Tuesday', 'Thursday', 'Saturday'] : ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'] })));
  await User.create({ name: 'Hospital Admin', email: 'admin@carefirst.com', password: await bcrypt.hash('Admin@123', 10), role: 'admin' });
  console.log('Seeded. Admin login: admin@carefirst.com / Admin@123'); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
