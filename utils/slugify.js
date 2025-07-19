function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")       // Remove non-word characters
    .replace(/[\s_-]+/g, "-")       // Replace spaces and underscores with -
    .replace(/^-+|-+$/g, "");       // Trim - from start and end
}

export default slugify;
