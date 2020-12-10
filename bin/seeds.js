require("dotenv").config()
require("../config/db.config")
const faker = require("faker")

const User = require("../models/User.model")
const Biopsy = require("../models/Biopsy.model")
const History = require("../models/History.model")

const userN = 90
const historyN = 5
const biopsyN = 5

const historyId = []

Promise.all([
  User.deleteMany(),
  Biopsy.deleteMany(),
  History.deleteMany()
])
  .then(() => {

    for (let i = 0; i < userN; i++) {
      const user = new User({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: "Moliver123",
        avatar: 'https://res.cloudinary.com/dutvbml2i/image/upload/v1603784830/victs/foto-perfil.jpg',
        address: faker.address.streetAddress(),
        zipcode: faker.random.number({min: 28000, max: 28999}),
        city: faker.address.city(),
        birthdate: faker.date.past(),
        sex: faker.random.arrayElement(['Hombre', 'Mujer']),
        phone: faker.phone.phoneNumber(),
        createdAt: faker.date.past(),
        role: 'Guest',
        activation: {
          active: true
        }
      })
      user.save()
        .then(u => {
          for (j = 0; j < historyN; j++) {
            const history = new History({
              user: u.id,
              title: faker.lorem.words(),
              resume: faker.lorem.paragraphs(),
              treatment: faker.lorem.paragraph()
            })
            history.save()
              .then(h => {
                historyId.push(h.id)
                console.log(`History: ${u.email}`)
                for (k = 0; k < biopsyN; k++) {
                  const biopsy = new Biopsy({
                    history: historyId[Math.floor(Math.random() * historyId.length)],
                    resume: faker.lorem.words()
                  })
                  biopsy.save()
                    .then(c => {
                      console.log('biopsy added')
                    })
                    .catch((e) => console.log(e))
                }
              })
              .catch((e) => console.log(e))
          }
        })
        .catch((e) => console.log(e))
    }
  })
  .catch((e) => console.log(e))
