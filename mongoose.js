const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// 1. User Schema
const UserSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  avatar: { type: String, default: '' },
  department: { type: String, default: 'General' },
  password_changed: { type: Number, default: 0 }
}, { timestamps: true });

// 2. Post Schema
const PostSchema = new Schema({
  _id: { type: String, required: true },
  user_id: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: String, default: '' },
  media_url: { type: String, default: null },
  pdf_url: { type: String, default: null },
  category: { type: String, default: 'campus' },
  created_at: { type: String, default: () => new Date().toISOString() },
  likes_count: { type: Number, default: 0 }
}, { timestamps: false });

// 3. Comment Schema
const CommentSchema = new Schema({
  _id: { type: String, required: true },
  post_id: { type: String, required: true },
  user_id: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: String, default: () => new Date().toISOString() }
}, { timestamps: false });

// 4. Like Schema
const LikeSchema = new Schema({
  _id: { type: String, required: true },
  post_id: { type: String, required: true },
  user_id: { type: String, required: true }
}, { timestamps: false });
LikeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

// 5. Task Schema
const TaskSchema = new Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, default: 'todo' },
  assignee_id: { type: String, default: null },
  created_at: { type: String, default: () => new Date().toISOString() }
}, { timestamps: false });

// 6. Poll Schema
const PollSchema = new Schema({
  _id: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  votes: { type: Schema.Types.Mixed, default: {} },
  voted_users: [{ type: String }],
  created_at: { type: String, default: () => new Date().toISOString() }
}, { timestamps: false });

// 7. Attendance Schema
const AttendanceSchema = new Schema({
  _id: { type: String, required: true },
  course_code: { type: String, required: true },
  student_id: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true },
  method: { type: String, required: true },
  marked_by: { type: String, default: null },
  is_locked: { type: Number, default: 0 },
  tx_hash: { type: String, default: null },
  created_at: { type: String, default: () => new Date().toISOString() }
}, { timestamps: false });

// 8. Student Registration Schema
const StudentRegistrationSchema = new Schema({
  _id: { type: String, required: true },
  student_id: { type: String, required: true },
  session: { type: String, required: true },
  status: { type: String, default: 'PENDING' },
  advisor_approved: { type: Number, default: 0 },
  hod_approved: { type: Number, default: 0 },
  dean_approved: { type: Number, default: 0 },
  registrar_approved: { type: Number, default: 0 },
  fee_status: { type: String, default: 'PENDING' },
  created_at: { type: String, default: () => new Date().toISOString() }
}, { timestamps: false });

// 9. Sports Athlete Schema
const SportsAthleteSchema = new Schema({
  _id: { type: String, required: true },
  user_id: { type: String, required: true },
  status: { type: String, default: 'Active' },
  medical_records: { type: String, default: '' },
  fitness_scores: { type: Schema.Types.Mixed, default: {} },
  achievements: [{ type: String }],
  ranking: { type: Number, default: 0 },
  statistics: { type: Schema.Types.Mixed, default: {} },
  scholarship_id: { type: String, default: null },
  created_at: { type: String, default: () => new Date().toISOString() }
}, { timestamps: false });

// 10. Sports Team Schema
const SportsTeamSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  sport: { type: String, required: true },
  captain_id: { type: String, default: null },
  roster: { type: Schema.Types.Mixed, default: [] },
  stats: { type: Schema.Types.Mixed, default: {} },
  created_at: { type: String, default: () => new Date().toISOString() }
}, { timestamps: false });

// 11. Sports Match Schema
const SportsMatchSchema = new Schema({
  _id: { type: String, required: true },
  tournament_id: { type: String, default: null },
  sport: { type: String, required: true },
  team_a: { type: String, required: true },
  team_b: { type: String, required: true },
  schedule: { type: String, required: true },
  venue: { type: String, required: true },
  status: { type: String, default: 'Scheduled' }
}, { timestamps: false });

// 12. Market Portfolio Schema
const MarketPortfolioSchema = new Schema({
  _id: { type: String, required: true },
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  balance: { type: Number, default: 100000.0 },
  holdings: { type: Schema.Types.Mixed, default: [] },
  created_at: { type: String, default: () => new Date().toISOString() }
}, { timestamps: false });

// 13. Market Transaction Schema
const MarketTransactionSchema = new Schema({
  _id: { type: String, required: true },
  portfolio_id: { type: String, required: true },
  user_id: { type: String, default: '' },
  symbol: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() }
}, { timestamps: false });

// 14. Key-Value Store Schema
const KVStoreSchema = new Schema({
  _id: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  updated_at: { type: String, default: () => new Date().toISOString() }
}, { timestamps: false });

// Compile Models safely
const getOrCreateModel = (name, schema) => mongoose.models[name] || mongoose.model(name, schema);

const User = getOrCreateModel('User', UserSchema);
const Post = getOrCreateModel('Post', PostSchema);
const Comment = getOrCreateModel('Comment', CommentSchema);
const Like = getOrCreateModel('Like', LikeSchema);
const Task = getOrCreateModel('Task', TaskSchema);
const Poll = getOrCreateModel('Poll', PollSchema);
const Attendance = getOrCreateModel('Attendance', AttendanceSchema);
const StudentRegistration = getOrCreateModel('StudentRegistration', StudentRegistrationSchema);
const SportsAthlete = getOrCreateModel('SportsAthlete', SportsAthleteSchema);
const SportsTeam = getOrCreateModel('SportsTeam', SportsTeamSchema);
const SportsMatch = getOrCreateModel('SportsMatch', SportsMatchSchema);
const MarketPortfolio = getOrCreateModel('MarketPortfolio', MarketPortfolioSchema);
const MarketTransaction = getOrCreateModel('MarketTransaction', MarketTransactionSchema);
const KVStore = getOrCreateModel('KVStore', KVStoreSchema);

let isConnected = false;

async function connectMongoDB(uri) {
  if (isConnected) return true;
  const mongoURI = uri || process.env.MONGODB_URI || 'mongodb+srv://campusx_admin:CampusX2026SecurePass@cluster0.campusx.mongodb.net/campusx_os?retryWrites=true&w=majority';
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000
    });
    isConnected = true;
    console.log('✓ Connected to Cloud MongoDB Database via Mongoose.');
    return true;
  } catch (err) {
    console.warn('⚠ Could not connect to external Cloud MongoDB. Operating with SQLite local/snapshot engine:', err.message);
    return false;
  }
}

module.exports = {
  connectMongoDB,
  User,
  Post,
  Comment,
  Like,
  Task,
  Poll,
  Attendance,
  StudentRegistration,
  SportsAthlete,
  SportsTeam,
  SportsMatch,
  MarketPortfolio,
  MarketTransaction,
  KVStore,
  mongoose
};
