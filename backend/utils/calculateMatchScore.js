// A simple helper function to calculate text similarity using basic token intersection
const getSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  
  const words1 = str1.toLowerCase().split(/\W+/);
  const words2 = str2.toLowerCase().split(/\W+/);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  const intersection = words1.filter(word => words2.includes(word));
  return intersection.length / Math.max(words1.length, words2.length);
};

const calculateMatchScore = (lostItem, foundItem) => {
  let score = 0;
  const matchDetails = [];

  // 1. Category match (20 points)
  if (lostItem.category.toLowerCase() === foundItem.category.toLowerCase()) {
    score += 20;
    matchDetails.push('Exact category match');
  }

  // 2. Title similarity (20 points max)
  const titleSim = getSimilarity(lostItem.title, foundItem.title);
  if (titleSim > 0) {
    const titleScore = Math.round(titleSim * 20);
    score += titleScore;
    if (titleScore >= 10) matchDetails.push('Similar titles');
  }

  // 3. Description similarity (15 points max)
  const descSim = getSimilarity(lostItem.description, foundItem.description);
  if (descSim > 0) {
    const descScore = Math.round(descSim * 15);
    score += descScore;
    if (descScore >= 7) matchDetails.push('Similar descriptions');
  }

  // 4. Location match (15 points max)
  const locSim = getSimilarity(lostItem.location, foundItem.location);
  if (locSim > 0) {
    const locScore = Math.round(locSim * 15);
    score += locScore;
    if (locScore >= 7) matchDetails.push('Locations are similar');
  }

  // 5. Color match (10 points max)
  if (lostItem.color && foundItem.color && lostItem.color.toLowerCase() === foundItem.color.toLowerCase()) {
    score += 10;
    matchDetails.push('Matching color');
  }

  // 6. Brand match (10 points max)
  if (lostItem.brand && foundItem.brand && lostItem.brand.toLowerCase() === foundItem.brand.toLowerCase()) {
    score += 10;
    matchDetails.push('Matching brand');
  }

  // 7. Date closeness (10 points max)
  // Ensure the found date is on or after the lost date
  const lostDate = new Date(lostItem.dateLost);
  const foundDate = new Date(foundItem.dateFound);
  
  if (foundDate >= lostDate) {
    // Calculate difference in days
    const diffTime = Math.abs(foundDate - lostDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      score += 10; // Found same or next day
      matchDetails.push('Found within 24 hours of being lost');
    } else if (diffDays <= 7) {
      score += 5; // Found within a week
      matchDetails.push('Found within a week of being lost');
    } else if (diffDays <= 30) {
      score += 2; // Found within a month
    }
  }

  // Create a summary text
  let summary = '';
  if (score >= 70) {
    summary = `Highly likely match (${score}%). ` + matchDetails.join(', ') + '.';
  } else if (score >= 40) {
    summary = `Possible match (${score}%). ` + matchDetails.join(', ') + '.';
  } else {
    summary = `Low probability match (${score}%).`;
  }

  return {
    score,
    summary
  };
};

module.exports = calculateMatchScore;
