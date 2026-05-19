const formatDate = (date) => {

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );
};

export {
  formatDate
};