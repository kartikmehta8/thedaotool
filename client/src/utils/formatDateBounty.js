function formatDateBounty(input) {
  const date =
    typeof input === 'string'
      ? new Date(input)
      : input?._seconds
        ? new Date(input._seconds * 1000)
        : null;

  if (!date || isNaN(date)) return 'Invalid Date';

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default formatDateBounty;
