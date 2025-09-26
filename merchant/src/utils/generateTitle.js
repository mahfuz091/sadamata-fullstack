const generateBlogId=(title)=> {
  return title
    .toLowerCase()                       // convert to lowercase
    .trim()                              // remove leading/trailing whitespace
    .replace(/[^\w\s-]/g, '')            // remove non-word characters (except space and hyphen)
    .replace(/\s+/g, '-')                // replace spaces with hyphens
    .replace(/-+/g, '-');                // replace multiple hyphens with a single one
}


export default generateBlogId;