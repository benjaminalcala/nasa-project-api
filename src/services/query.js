const DEFAULT_LIMIT = 0;
const DEFAULT_PAGE = 1;

function getPagination(query){
  const limit =  query.limit || DEFAULT_LIMIT;
  const page = query.page || DEFAULT_PAGE;

  const skip = (page - 1) * limit;
  return {
    skip,
    limit
  }
}

module.exports = {
  getPagination
}