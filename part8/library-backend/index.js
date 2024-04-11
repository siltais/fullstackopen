const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const typeDefs =`
  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: ID!
  }
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres:[String!]!
    id: ID!
  }
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String): [Book!]!
    allAuthors:[Author!]!
  }
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(genre: String): [Book!]!
    allAuthors:[Author!]!
  }
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks:[Book!]!
    allAuthors:[Author!]!
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
  `

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let booksToReturn = await Book.find({}).populate('author', { name: 1 })

      if (!args.author && !args.genre) {
        return booksToReturn
      }    
      if(args.author){
        booksToReturn = booksToReturn.filter(b => b.author.name === args.author)
      }
      if(args.genre){
        booksToReturn = booksToReturn.filter(b => b.genres.includes(args.genre.toLowerCase()))
      }
      return booksToReturn
    },
    allAuthors: async () => await Author.find({})
  },
  Author:{
    bookCount: async (root) => {
      let countBooks = 0
      const books = await Book.find({}).populate('author', { name: 1 })
      books.forEach((book) => {
        if(root.name === book.author.name){
          countBooks++
        }
      })
      return countBooks
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })
      if(!author){
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (e) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              e
            }
          })
        }       
      }
      const book = new Book({ ...args, author: { ...author } })
      try{
        await book.save()
      } catch (e) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            e
          }
        })
      }
      await book.populate('author', { name: 1 })
      return book      
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      try {
        await author.save()
      } catch (e) {
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            e
          }
        })
      }    
      return author
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})