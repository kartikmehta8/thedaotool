function truncateWords(text, limit = 40) {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(' ') + '... see more';
}

export default truncateWords;
