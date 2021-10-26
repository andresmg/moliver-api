require('dotenv').config()
require('../config/db.config')
const faker = require('faker')

const User = require('../models/User.model')
const Biopsy = require('../models/Biopsy.model')
const BiopsyNumber = require('../models/BiopsyNumber.model')
const History = require('../models/History.model')
const Blog = require('../models/Blog.model')

const userN = 90
const biopsyN = 3
const historyN = 3
const blogN = 1

let num = 1

Promise.all([
  User.deleteMany(),
  Biopsy.deleteMany(),
  BiopsyNumber.deleteMany(),
  History.deleteMany(),
  Blog.deleteMany()
])
  .then(() => {

    const biopsynumber = new BiopsyNumber()
    biopsynumber.save()
      .then(b => console.log('paciente creado'))
      .catch((e) => console.log(e))

    for (let i = 0; i < userN; i++) {
      const user = new User({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: 'Moliver123',
        dni: faker.random.number({min: 4000000, max: 20000000}),
        avatar: 'https://res.cloudinary.com/dutvbml2i/image/upload/v1607677904/moliver/foto-perfil.jpg',
        address: faker.address.streetAddress(),
        zipcode: faker.random.number({min: 28000, max: 28999}),
        city: faker.address.city(),
        birthdate: faker.date.past(),
        sex: faker.random.arrayElement(['Hombre', 'Mujer']),
        work: faker.name.jobType(),
        next_date: {
          isDate: true,
          date: faker.date.future()
        },
        phone: faker.phone.phoneNumber(),
        createdAt: faker.date.past(),
        role: 'Guest',
        activation: {
          active: true
        }
      })
      user.save()
        .then(u => {
          console.log(`user added ${user.name}`)
          for (k = 0; k < biopsyN; k++) {
            const biopsy = new Biopsy({
              user: u.id,
              number: `${faker.random.arrayElement(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'])} - ${num++} - ${faker.random.number({min: 2012, max: 2021})}`,
              reference: faker.lorem.words(),
              material: faker.lorem.word(),
              clinic_diagnosis: faker.lorem.words(),
              report: faker.lorem.paragraphs(),
              diagnostics: faker.lorem.paragraphs()
            })
            biopsy.save()
              .then(c => {
                console.log(`biopsy added for ${u.email}`)
              })
              .catch((e) => console.log(e))
          }
          for (m = 0; m < historyN; m++) {
            const history = new History({
              user: u.id,
              date: faker.date.past(),
              visit_reason: faker.lorem.words(),
              clinic_history: faker.lorem.words(),
              diagnostics: faker.lorem.paragraphs(),
              treatment: faker.lorem.paragraphs()
            })
            history.save()
              .then(c => {
                console.log(`history added for ${u.email}`)
              })
              .catch((e) => console.log(e))
          }
          for (let n = 0; n < blogN; n++) {
            const blog = new Blog({
              title: faker.lorem.words(),
              content: faker.lorem.paragraphs(5),
              authorId: u.id,
              picPath: faker.image.image()
            })
            blog.save()
              .then(blogitem => {
                console.log(`blog creado ${blogitem.title}`)
              })
              .catch((e) => console.log(e))
          }
        })
        .catch((e) => console.log(e))
    }
  })
  .catch((e) => console.log(e))
