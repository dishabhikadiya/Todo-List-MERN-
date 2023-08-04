class Api {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }
  search() {
    const keyword = this.querystr.keyword
      ? {
          title: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    console.log("===========================", this.query, this.querystr);
    const queryCopy = { ...this.queryStr };

    const removeFields = [
      "keyword",
      "page",
      "limit",
      "resultPerPage",
      "sortkey",
      "sortorder",
    ];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating

    let queryStr = JSON.stringify(queryCopy);

    console.log("queryStr", queryStr);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    console.log("queryStr: " + queryStr);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultperpage) {
    const currentpage = Number(this.querystr.page) || 1;
    const skip = resultperpage * (currentpage - 1);
    this.query = this.query.limit(resultperpage).skip(skip);
    return this;
  }

  sort() {
    let val = this.querystr.sortorder;
    let key = this.querystr.sortkey;
    console.log("val", val, "key", key);
    this.query = this.query.sort({ [key]: val });
    return this;
  }
}
module.exports = Api;
