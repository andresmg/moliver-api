require("dotenv").config()
require("../config/db.config")
const faker = require("faker")
const services = require('../data/services')
const disciplines = require('../data/disciplines')

const User = require("../models/User.model")
const Gym = require("../models/Gimnasium.model")
const Instructor = require("../models/Instructor.model")
const Classroom = require("../models/Classroom.model")
const Lesson = require("../models/Lesson.model")
const Reservations = require("../models/Reservations.model")
const WaitingList = require('../models/Waitinglist.model')

const userN = 90
const classroomN = 5
const lessonN = 5

const gymId = []
const classroomId = []
const usersId = []
const instructorId = []

Promise.all([
  User.deleteMany(),
  Classroom.deleteMany(),
  Gym.deleteMany(),
  Instructor.deleteMany(),
  Lesson.deleteMany(),
  Reservations.deleteMany(),
  WaitingList.deleteMany()
])
  .then(() => {
    console.log('all databases erased')
    for (let i = 0; i < userN; i++) {
      if (i < 30) {
        const user = new User({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: "Victsuser123",
          avatar: 'https://res.cloudinary.com/dutvbml2i/image/upload/v1603784830/victs/foto-perfil.jpg',
          address: faker.address.streetAddress(),
          zipcode: faker.random.number({min: 28000, max: 28999}),
          city: faker.address.city(),
          phone: faker.phone.phoneNumber(),
          createdAt: faker.date.past(),
          role: 'Guest',
          activation: {
            active: true
          }
        })
        user.save()
          .then(u => {
            usersId.push(u.id)
            console.log(`Guest: ${u.email}`)
          })
          .catch((e) => console.log(e))
      } else if (i >= 30 && i < 60) {
        const user = new User({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: "Victsgym123",
          avatar: 'https://res.cloudinary.com/dutvbml2i/image/upload/v1603784830/victs/foto-perfil.jpg',
          address: faker.address.streetAddress(),
          zipcode: faker.random.number({min: 28000, max: 28999}),
          city: faker.address.city(),
          phone: faker.phone.phoneNumber(),
          createdAt: faker.date.past(),
          role: 'Gym',
          activation: {
            active: true
          }
        })
        user.save()
          .then(u => {
            const gym = new Gym({
              user: u.id,
              services: faker.random.arrayElement(services.map((s) => s.name)),
            })
            gym.save()
              .then(g => {
                gymId.push(g.id)
                console.log(`Gym: ${u.email}`)
                for (j = 0; j < classroomN; j++) {
                  const classroom = new Classroom({
                    gym: g.id,
                    user: u.id,
                    name: faker.name.findName(),
                    rows: [3, 2, 3, 4],
                    discipline: faker.random.arrayElement(disciplines.map((d) => d.name))
                  })
                  classroom.save()
                    .then(c => {
                      classroomId.push(c.id)
                    })
                    .catch((e) => console.log(e))
                }
              })
              .catch((e) => console.log(e))
          })
          .catch((e) => console.log(e))
      } else {
        const user = new User({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: "Victsteacher123",
          avatar: 'https://res.cloudinary.com/dutvbml2i/image/upload/v1603784830/victs/foto-perfil.jpg',
          address: faker.address.streetAddress(),
          zipcode: faker.random.number({min: 28000, max: 28999}),
          city: faker.address.city(),
          phone: faker.phone.phoneNumber(),
          createdAt: faker.date.past(),
          role: 'Instructor',
          activation: {
            active: true
          }
        })
        user.save()
          .then(u => {
            const instructor = new Instructor({
              user: u.id,
              disciplines: faker.random.arrayElement(disciplines.map((d) => d.name)),
              quote: faker.lorem.sentence()
            })
            instructor.save()
              .then(i => {
                instructorId.push(i.id)
                console.log(`Instructor: ${u.email}`)
                for (j = 0; j < lessonN; j++) {
                  const lesson = new Lesson({
                    gym: gymId[Math.floor(Math.random() * gymId.length)],
                    user: usersId[Math.floor(Math.random() * usersId.length)],
                    instructor: instructorId[Math.floor(Math.random() * instructorId.length)],
                    name: faker.name.findName(),
                    classroom: classroomId[Math.floor(Math.random() * classroomId.length)],
                    address: faker.address.streetAddress(),
                    zipcode: faker.random.number({min: 28000, max: 28999}),
                    city: faker.address.city(),
                    discipline: faker.random.arrayElement(disciplines.map((d) => d.name)),
                    date: faker.date.future(),
                    duration: 45,
                    details: faker.lorem.sentence(),
                    capacity: faker.random.number({min: 10, max: 30})
                  })
                  lesson.save()
                    .then(c => console.log(`LESSON: CREATED`))
                    .catch((e) => console.log(e))
                }
              })
              .catch((e) => console.log(e))
          })
          .catch((e) => console.log(e))
      }
    }
  })
  .catch((e) => console.log(e))
