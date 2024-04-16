const typeDefs =`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
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
    me: User
  }
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(genre: String): [Book!]!
    allAuthors:[Author!]!
    me: User
  }
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks:[Book!]!
    allAuthors:[Author!]!
    me: User
  }
  type Mutation {
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
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
  type Subscription {
    bookAdded: Book!
  }
`


  module.exports = typeDefs