import { v4 as uuidv4 } from 'uuid';

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍕', type: 'expense' },
  { name: 'Transport', icon: '🚗', type: 'expense' },
  { name: 'Shopping', icon: '🛍️', type: 'expense' },
  { name: 'Entertainment', icon: '🎬', type: 'expense' },
  { name: 'Bills & Utilities', icon: '💡', type: 'expense' },
  { name: 'Health', icon: '🏥', type: 'expense' },
  { name: 'Education', icon: '📚', type: 'expense' },
  { name: 'Subscriptions', icon: '📱', type: 'expense' },
  { name: 'Rent', icon: '🏠', type: 'expense' },
  { name: 'Other', icon: '📦', type: 'expense' },
  { name: 'Savings', icon: '💰', type: 'savings' },
  { name: 'Investments', icon: '📈', type: 'savings' },
];

const LEARNING_CONTENT = [
  {
    id: uuidv4(),
    title: 'The 50/30/20 Rule',
    body: 'A simple budgeting framework: spend 50% of income on needs (rent, food, bills), 30% on wants (entertainment, shopping), and save 20%. Start by tracking your expenses for a month to see where you stand.',
    category: 'budgeting',
    icon: '📊'
  },
  {
    id: uuidv4(),
    title: 'Emergency Fund 101',
    body: 'An emergency fund covers 3-6 months of expenses. Start small — even ₹500/month adds up. Keep it in a savings account or liquid fund for easy access. This is your financial safety net.',
    category: 'saving',
    icon: '🛡️'
  },
  {
    id: uuidv4(),
    title: 'Understanding Credit Scores',
    body: 'Your CIBIL score (300-900) affects loan approvals and interest rates. Pay bills on time, keep credit utilization below 30%, and avoid too many loan applications. Check your score free at cibil.com.',
    category: 'credit',
    icon: '📋'
  },
  {
    id: uuidv4(),
    title: 'Power of Compound Interest',
    body: "If you invest ₹5,000/month at 12% annual returns, you'll have ₹1 crore in about 20 years. Start early — even small amounts grow exponentially over time. SIPs make this easy.",
    category: 'saving',
    icon: '🚀'
  },
  {
    id: uuidv4(),
    title: 'Needs vs Wants',
    body: 'Before any purchase, ask: "Do I need this or want this?" Needs are essentials (food, shelter, health). Wants are nice-to-haves. This simple check can save you thousands each month.',
    category: 'budgeting',
    icon: '🤔'
  },
  {
    id: uuidv4(),
    title: 'Tax Saving for Beginners',
    body: 'Section 80C lets you save up to ₹1.5 lakh on investments like ELSS, PPF, and NPS. Section 80D covers health insurance premiums. Start tax planning early in the financial year.',
    category: 'saving',
    icon: '📑'
  },
  {
    id: uuidv4(),
    title: 'Digital Payment Safety',
    body: 'Never share your UPI PIN or OTP. Use official apps only. Enable transaction alerts. Set daily UPI limits. If you suspect fraud, call your bank immediately and file a complaint on cybercrime.gov.in.',
    category: 'credit',
    icon: '🔒'
  },
  {
    id: uuidv4(),
    title: 'The Latte Factor',
    body: '₹150/day on coffee = ₹4,500/month = ₹54,000/year. Identify your "latte factor" — those small, regular expenses you can cut or reduce to boost savings.',
    category: 'budgeting',
    icon: '☕'
  },
];

export async function seedDefaultCategories(db, userId) {
  const query = 'INSERT INTO categories (id, user_id, name, icon, type) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING';
  const categories = [];
  for (const cat of DEFAULT_CATEGORIES) {
    const id = uuidv4();
    await db.query(query, [id, userId, cat.name, cat.icon, cat.type]);
    categories.push({ id, ...cat });
  }
  return categories;
}

export async function seedLearningContent(db) {
  const existing = await db.query('SELECT COUNT(*) as count FROM learning_content');
  if (parseInt(existing.rows[0].count) > 0) return;

  const query = 'INSERT INTO learning_content (id, title, body, category, icon) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING';
  for (const content of LEARNING_CONTENT) {
    await db.query(query, [content.id, content.title, content.body, content.category, content.icon]);
  }
}

export async function seedDemoTransactions(db, userId) {
  const { rows: categories } = await db.query('SELECT id, name FROM categories WHERE user_id = $1', [userId]);
  if (categories.length === 0) return;

  const catMap = {};
  categories.forEach(c => { catMap[c.name] = c.id; });

  const sampleTransactions = [
    { category: 'Food & Dining', amount: 450, note: 'Lunch at office canteen' },
    { category: 'Food & Dining', amount: 1200, note: 'Dinner with friends' },
    { category: 'Food & Dining', amount: 280, note: 'Chai and snacks' },
    { category: 'Transport', amount: 350, note: 'Uber ride to meeting' },
    { category: 'Transport', amount: 150, note: 'Metro pass recharge' },
    { category: 'Shopping', amount: 2500, note: 'New headphones' },
    { category: 'Shopping', amount: 899, note: 'T-shirt from Myntra' },
    { category: 'Entertainment', amount: 499, note: 'Movie tickets' },
    { category: 'Bills & Utilities', amount: 1800, note: 'Electricity bill' },
    { category: 'Bills & Utilities', amount: 599, note: 'WiFi bill' },
    { category: 'Subscriptions', amount: 199, note: 'Spotify subscription' },
    { category: 'Subscriptions', amount: 649, note: 'Netflix subscription' },
    { category: 'Health', amount: 750, note: 'Gym membership' },
    { category: 'Education', amount: 999, note: 'Udemy course' },
    { category: 'Rent', amount: 15000, note: 'Monthly rent' },
    { category: 'Food & Dining', amount: 380, note: 'Groceries' },
    { category: 'Transport', amount: 200, note: 'Auto rickshaw' },
    { category: 'Other', amount: 500, note: 'Gift for friend' },
  ];

  const query = 'INSERT INTO transactions (id, user_id, amount, category_id, date, note) VALUES ($1, $2, $3, $4, $5, $6)';

  for (const t of sampleTransactions) {
    const catId = catMap[t.category] || categories[0].id;
    const daysAgo = Math.floor(Math.random() * 28) + 1;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split('T')[0];
    await db.query(query, [uuidv4(), userId, t.amount, catId, dateStr, t.note]);
  }
}
