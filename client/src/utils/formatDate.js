function formatDate(isoString) {
  const date = new Date(isoString);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleString(undefined, options);
}

export default formatDate;
