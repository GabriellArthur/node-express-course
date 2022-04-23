const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
   const products = await Product.find({ price: { $gt: 30 } })
      .sort('price')
      .select('name price')
   //.limit(10)
   //.skip(1)
   res.status(200).json({ nbHits: products.length, products })
}
//throw new Error('testing async errors')
//products?sorte=name,-price (name ordenado e menor preco)
/**
 * Person.
 *    find({
 *       ocuppation:/host/,
 *       'name.last':'Ghost', 
 *       age:{$gt:17,$lt:66},
 *       likes:{$in:['vaporizing','talking']}
 *    }).
 *    limit(10).
 *    sort({occupation:-1}).
 *    select({name:1,occupation:1}).
 *    exec(callback)
 * 
 * Person.
 *    find({ocuppation:/host/}).
 *    where('name.last').equals('Ghost').
 *    where('age').gt(17).lt(66).
 *    where('like').in(['vaporizing','talking']).
 *    limit(10).
 *    sort('-occupation').
 *    select('name occupation').
 *    exec(callback);
*/

const getAllProducts = async (req, res) => {
   const { featured, company, name, sort, fields, numericFilters } = req.query
   const queryObject = {}

   if (featured) {
      queryObject.featured = featured === 'true' ? true : false
   }
   if (company) {
      queryObject.company = company
   }
   if (name) {
      queryObject.name = { $regex: name, $options: 'i' }
   }

   if (numericFilters) {
      const operatorMap = {
         '>': '$gt',
         '>=': '$gte',
         '=': '$e',
         '<': '$lt',
         '<=': '$lte',
      }
      const regEx = /\b(<|>|>=|=|<|<=)\b/g
      let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
      const options = ['price', 'rating'];
      filters = filters.split(',').forEach((item) => {
         const [field, operator, value] = item.split('-')
         if (options.includes(field)) {
            queryObject[field] = { [operator]: Number(value) }
         }
      })
   }


   console.log(queryObject)
   let result = Product.find(queryObject)
   //sort
   if (sort) {
      const sortList = sort.split(',').join(' ');
      result = result.sort(sortList)
   } else {
      result = result.sort('createdAt')
   }
   //fields
   if (fields) {
      const fieldsList = fields.split(',').join(' ');
      result = result.select(fieldsList)
   }
   const page = Number(req.query.page) || 1
   const limit = Number(req.query.limit) || 10
   const skip = (page - 1) * limit;

   result = result.skip(skip).limit(limit)
   //23 products, 4 pages(7,7,7,2)

   const products = await result
   res.status(200).json({ nbHits: products.length, products })
}

module.exports = {
   getAllProducts,
   getAllProductsStatic,
}