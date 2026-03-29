export function generateFinGuruResponse(query, userData) {
  const q = query.toLowerCase().trim();
  const { income, transactions, budgets } = userData;

  // Calculate spending by category
  const spending = {};
  let totalExpenses = 0;
  (transactions || []).forEach(t => {
    const catName = t.category_name || 'Other';
    spending[catName] = (spending[catName] || 0) + t.amount;
    totalExpenses += t.amount;
  });

  const sortedCategories = Object.entries(spending).sort(([, a], [, b]) => b - a);
  const topCategory = sortedCategories[0];
  const savingsRate = income > 0 ? ((income - totalExpenses) / income * 100).toFixed(1) : 0;

  if (q.includes('save more') || q.includes('saving') || q.includes('save money')) {
    if (sortedCategories.length === 0) {
      return "Start by tracking your expenses! Once I can see where your money goes, I'll give you personalized saving tips. 💡";
    }
    const tips = [];
    if (topCategory) {
      tips.push(`Your biggest expense is **${topCategory[0]}** at ₹${topCategory[1].toLocaleString('en-IN')}. Consider setting a budget here and finding alternatives.`);
    }
    if (spending['Subscriptions']) {
      tips.push(`You're spending ₹${spending['Subscriptions'].toLocaleString('en-IN')} on subscriptions. Review if you're using all of them.`);
    }
    if (spending['Food & Dining'] && income > 0) {
      const foodPercent = (spending['Food & Dining'] / income * 100).toFixed(0);
      tips.push(`Food & Dining takes ${foodPercent}% of your income. Try meal prepping to cut costs!`);
    }
    tips.push('Try the **50/30/20 rule**: 50% needs, 30% wants, 20% savings.');
    return `Here are some ways to save more:\n\n${tips.map((t, i) => `${i + 1}. ${t}`).join('\n\n')}\n\nYour current savings rate is **${savingsRate}%**. ${Number(savingsRate) >= 20 ? "Great job! 🎉" : "Let's work on getting this above 20%! 💪"}`;
  }

  if (q.includes('overspend') || q.includes('spending too much') || q.includes('over budget')) {
    if (budgets && budgets.length > 0) {
      const overBudget = budgets.filter(b => {
        const spent = spending[b.category_name] || 0;
        return spent > b.monthly_limit;
      });
      if (overBudget.length > 0) {
        const alerts = overBudget.map(b => {
          const spent = spending[b.category_name] || 0;
          const over = spent - b.monthly_limit;
          return `- **${b.category_name}**: Spent ₹${spent.toLocaleString('en-IN')} / Budget ₹${b.monthly_limit.toLocaleString('en-IN')} (₹${over.toLocaleString('en-IN')} over!)`;
        });
        return `You're over budget in ${overBudget.length} categor${overBudget.length > 1 ? 'ies' : 'y'}:\n\n${alerts.join('\n')}\n\nTry reducing discretionary spending and setting daily limits. Small changes add up! 💡`;
      }
    }
    if (totalExpenses > income * 0.8) {
      return `You've spent ₹${totalExpenses.toLocaleString('en-IN')} this month — that's ${(totalExpenses / income * 100).toFixed(0)}% of your income! Focus on cutting non-essential expenses like ${topCategory ? topCategory[0] : 'eating out'}.`;
    }
    return "Your spending looks reasonable this month! Keep tracking your expenses to stay on top of it. 📊";
  }

  if (q.includes('savings rate') || q.includes('how much am i saving')) {
    return `Your savings rate this month is **${savingsRate}%**.\n\n- Income: ₹${income.toLocaleString('en-IN')}\n- Expenses: ₹${totalExpenses.toLocaleString('en-IN')}\n- Saved: ₹${(income - totalExpenses).toLocaleString('en-IN')}\n\n${Number(savingsRate) >= 30 ? "Excellent! You're saving well! 🎯" : Number(savingsRate) >= 20 ? "Good job! You're meeting the 20% benchmark. 👍" : Number(savingsRate) >= 0 ? "Try to save at least 20% of your income. Look for areas to cut back. 💪" : "⚠️ You're spending more than you earn! Check your budget immediately."}`;
  }

  if (q.includes('budget') || q.includes('how to budget')) {
    return `Here's a simple budgeting strategy:\n\n1. **Track everything** — Log every expense, even small ones\n2. **Use the 50/30/20 rule** — Needs (50%), Wants (30%), Savings (20%)\n3. **Set category limits** — Go to the Budget tab to set monthly limits\n4. **Review weekly** — Check your progress every Sunday\n\n${income > 0 ? `Based on your income of ₹${income.toLocaleString('en-IN')}:\n- Needs: ₹${(income * 0.5).toLocaleString('en-IN')}\n- Wants: ₹${(income * 0.3).toLocaleString('en-IN')}\n- Savings: ₹${(income * 0.2).toLocaleString('en-IN')}` : 'Set your monthly income in Settings to get personalized budget recommendations!'}`;
  }

  if (q.includes('invest') || q.includes('where to invest') || q.includes('mutual fund') || q.includes('sip')) {
    return "Here are beginner-friendly investment options in India:\n\n1. **SIP in Index Funds** — Start with ₹500/month in Nifty 50 index fund\n2. **PPF** — Safe, tax-saving, 7.1% returns\n3. **FD** — Low risk, guaranteed returns\n4. **ELSS** — Mutual funds with tax benefits under 80C\n\n⚠️ Build an emergency fund first (3-6 months expenses), then invest. Start small and be consistent!";
  }

  if (q.includes('credit') || q.includes('cibil') || q.includes('credit score')) {
    return "Tips to build a good credit score:\n\n1. **Pay bills on time** — This is the #1 factor\n2. **Keep utilization below 30%** — Don't max out your credit card\n3. **Don't apply for too many loans** — Each application reduces your score\n4. **Check your score** — Free at cibil.com\n\nA score above 750 gets you the best loan rates! 📊";
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return `Hey there! 👋 I'm FinGuru, your personal finance assistant.\n\nHere's what I can help with:\n- 💰 "How can I save more?"\n- 📊 "What are my recent expenses?"\n- 📋 "How to budget?"\n- 📈 "Where to invest?"\n\nJust ask away!`;
  }

  if (q.includes('recent') || q.includes('latest') || q.includes('last expense') || q.includes('transactions')) {
    if (!transactions || transactions.length === 0) {
      return "You haven't logged any transactions yet. Add some on the Expenses tab!";
    }
    const recent = transactions.slice(0, 3).map(t => `- **${t.category_name || 'Expense'}**: ₹${t.amount.toLocaleString('en-IN')} on ${new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`);
    return `Here are your most recent transactions:\n\n${recent.join('\n')}\n\nKeep tracking to stay on top of your budget!`;
  }

  return `Great question! Here are some things I can help with:\n\n- "How can I save more?" — Personalized saving tips\n- "Why am I overspending?" — Budget analysis\n- "What's my savings rate?" — Income vs expenses\n- "How to budget?" — Budgeting strategies\n- "Where to invest?" — Beginner investment tips\n\nTry asking one of these! 😊`;
}
