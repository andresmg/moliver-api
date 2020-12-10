const mongoose = require("mongoose")

const User = require("../models/User.model")
const Gym = require("../models/Gimnasium.model")
const Instructor = require("../models/Instructor.model")
const createError = require("http-errors")
const Lesson = require("../models/Lesson.model")
const Reservations = require("../models/Reservations.model")
const Waitinglist = require("../models/Waitinglist.model")
const Social = require("../models/Social.model")


const Stripe = require("stripe")
const stripe = new Stripe(process.env.STRIPE_SECRET)

const nodemailer = require("../config/mailer.config")

module.exports.index = (req, res, next) => {
  res.json({title: "Welcome to VICTS!"})
}

module.exports.doLogin = (req, res, next) => {
  const {email, password} = req.body

  if (!email || !password) {
    throw createError(400, "Missing credentials")
  }

  User.findOne({email: email})
    .populate("reservations")
    .populate({
      path: "reservations",
      populate: {
        path: "lesson",
        model: "Lesson",
      },
    })
    .populate("waitinglists")
    .populate({
      path: "waitinglists",
      populate: {
        path: "lesson",
        model: "Lesson",
        populate: {
          path: "gym",
          model: "Gym",
        }
      },
    })
    .populate({
      path: "waitinglists",
      populate: {
        path: "lesson",
        model: "Lesson",
        populate: {
          path: "instructor",
          model: "Instructor",
        }
      },
    })
    .populate({
      path: "waitinglists",
      populate: {
        path: "lesson",
        model: "Lesson",
        populate: {
          path: "classroom",
          model: "Classroom",
        },
      },
    })
    .populate("lessons")
    .populate({
      path: "lessons",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .populate({
      path: "lessons",
      populate: {
        path: "gym",
        model: "Gym",
        populate: {
          path: "user",
          model: "User",
        },
      },
    })
    .populate({
      path: "lessons",
      populate: {
        path: "classroom",
        model: "Classroom",
      },
    })
    .populate({
      path: "lessons",
      populate: {
        path: "instructor",
        model: "Instructor",
        populate: {
          path: "user",
          model: "User",
        },
      },
    })
    .then((user) => {
      if (!user) {
        throw createError(404, "User not found, please try again")
      } else if (user.activation.active === false) {
        throw createError(404, "User is not active, please check your email")
      } else {
        return user
          .checkPassword(password)
          .then((match) => {
            if (!match) {
              throw createError(400, "Invalid password, please try again")
            } else {
              req.session.user = user
              if (user.role === "Gym") {
                Gym.findOne({user: user.id})
                  .populate("user")
                  .then((user) => {
                    res.status(201).json(user)
                  })
              } else if (user.role === "Instructor") {
                Instructor.findOne({user: user.id})
                  .populate("user")
                  .then((user) => res.status(201).json(user))
              } else if (user.role === "Guest") {
                res.status(201).json(user)
              } else if (user.role === "Admin") {
                res.status(201).json(user)
              }
            }
          })
          .catch(next)
      }
    })
    .catch(next)
}

module.exports.activateUser = (req, res, next) => {
  User.findOne({"activation.token": req.params.token})
    .then((user) => {
      if (user) {
        if (user.activation.active === true) {
          throw createError(401, "User is already active")
        } else {
          user.activation.active = true
          user
            .save()
            .then((user) => {
              res
                .status(201)
                .json({message: `${user.name}'s account has been activated`})
            })
            .catch(next)
        }
      } else {
        throw createError(400, "Oops! invalid token")
      }
    })
    .catch(next)
}

module.exports.follow = async (req, res, next) => {
  const userId = req.session.user.id
  const placeId = req.params.id

  const user = await User.findById(userId)

  if (user.following.includes(placeId)) {
    const delete1 = User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          following: placeId,
        },
      },
      {new: true}
    )
      .populate("lessons")
      .populate({
        path: "lessons",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "gym",
          model: "Gym",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "classroom",
          model: "Classroom",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "instructor",
          model: "Instructor",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate("reservations")
      .populate({
        path: "reservations",
        populate: {
          path: "lesson",
          model: "Lesson",
        },
      })
      .populate("waitinglists")
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "gym",
            model: "Gym",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "instructor",
            model: "Instructor",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "classroom",
            model: "Classroom",
          },
        },
      })
    const delete2 = User.findByIdAndUpdate(
      placeId,
      {
        $pull: {
          followers: userId,
        },
      },
      {new: true}
    )
      .populate("lessons")
      .populate({
        path: "lessons",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "gym",
          model: "Gym",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "classroom",
          model: "Classroom",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "instructor",
          model: "Instructor",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate("reservations")
      .populate({
        path: "reservations",
        populate: {
          path: "lesson",
          model: "Lesson",
        },
      })
      .populate("waitinglists")
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "gym",
            model: "Gym",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "instructor",
            model: "Instructor",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "classroom",
            model: "Classroom",
          },
        },
      })

    Promise.all([delete1, delete2])
      .then((updatedUser) => {
        res.status(201).json(updatedUser)
      })
      .catch((error) => next(createError(400, error)))
  } else {
    const following = User.findByIdAndUpdate(
      userId,
      {
        $push: {
          following: placeId,
        },
      },
      {new: true}
    )
      .populate("lessons")
      .populate({
        path: "lessons",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "gym",
          model: "Gym",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "classroom",
          model: "Classroom",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "instructor",
          model: "Instructor",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate("reservations")
      .populate({
        path: "reservations",
        populate: {
          path: "lesson",
          model: "Lesson",
        },
      })
      .populate("waitinglists")
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "gym",
            model: "Gym",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "instructor",
            model: "Instructor",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "classroom",
            model: "Classroom",
          },
        },
      })

    const follower = User.findByIdAndUpdate(
      placeId,
      {
        $push: {
          followers: userId,
        },
      },
      {new: true}
    )
      .populate("lessons")
      .populate({
        path: "lessons",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "gym",
          model: "Gym",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "classroom",
          model: "Classroom",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "instructor",
          model: "Instructor",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate("reservations")
      .populate({
        path: "reservations",
        populate: {
          path: "lesson",
          model: "Lesson",
        },
      })
      .populate("waitinglists")
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "gym",
            model: "Gym",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "instructor",
            model: "Instructor",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "classroom",
            model: "Classroom",
          },
        },
      })

    Promise.all([following, follower])
      .then((updatedUser) => {
        res.status(201).json(updatedUser)
      })
      .catch((error) => next(createError(400, error)))
  }
}

module.exports.stripeCheck = async (req, res) => {
  const {id, plan} = req.body
  const userId = req.session.user.id
  try {
    const payment = await stripe.paymentIntents.create({
      amount: plan.price * 100,
      currency: "EUR",
      description: `Plan de ${plan.price} €, ${plan.quantity} clases`,
      payment_method: id,
      confirm: true,
    })
    User.findByIdAndUpdate(
      userId,
      {
        $inc: {packages: plan.quantity},
      },
      {new: true}
    )
      .populate("lessons")
      .populate({
        path: "lessons",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "gym",
          model: "Gym",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "classroom",
          model: "Classroom",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "instructor",
          model: "Instructor",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate("reservations")
      .populate({
        path: "reservations",
        populate: {
          path: "lesson",
          model: "Lesson",
        },
      })
      .populate("waitinglists")
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "gym",
            model: "Gym",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "instructor",
            model: "Instructor",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "classroom",
            model: "Classroom",
          },
        },
      })
      .then((updatedUser) => {
        res.status(201).json(updatedUser)
      })
      .catch((error) => next(createError(400, error)))
  } catch (error) {
    return res.json({message: error})
  }
}

module.exports.logout = (req, res) => {
  req.session.destroy()
  res.status(204).json({message: "Bye! Come back soon!"})
}

module.exports.booking = async (req, res, next) => {
  const userId = req.session.user.id
  const {row, seat, id} = req.body
  const objectUserId = mongoose.Types.ObjectId(userId)

  const allBookings = await Reservations.find({lesson: id})

  const filteredAllBookings = allBookings.filter(
    (book) => book.row == row && book.column == seat
  )
  const checkIfUserAlreadyBook = allBookings.filter(
    (book) => book.user == userId
  )

  const enoughPackages = await User.findById(userId)

  if (filteredAllBookings.length) {
    return res.status(410).json({
      message: "Sorry, this seat has been booked, make it quickly next time",
    })
  } else if (checkIfUserAlreadyBook.length) {
    return res.status(410).json({
      message: "Sorry, you have already book in this class",
    })
  } else if (enoughPackages.packages > 0) {
    const createBook = await Reservations.create({
      row: row,
      column: seat,
      user: userId,
      lesson: id,
    })
    const getPackage = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {packages: -1},
      },
      {new: true}
    )

    const restCapacity = await Lesson.findByIdAndUpdate(
      id,
      {
        $inc: {capacity: -1},
        $push: {user: objectUserId},
      },
      {new: true}
    )

    const reservations = await Reservations.find({lesson: id})
      .populate("user")
      .populate("lesson")

    const user = await User.findById(userId)
      .populate("lessons")
      .populate({
        path: "lessons",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "gym",
          model: "Gym",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "classroom",
          model: "Classroom",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "instructor",
          model: "Instructor",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate("reservations")
      .populate({
        path: "reservations",
        populate: {
          path: "lesson",
          model: "Lesson",
        },
      })
      .populate("waitinglists")
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "gym",
            model: "Gym",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "instructor",
            model: "Instructor",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "classroom",
            model: "Classroom",
          },
        },
      })

    Promise.all([createBook, getPackage, restCapacity, reservations, user])
      .then((reservation) => res.status(201).json(reservation))
      .catch(next)
  } else {
    return res
      .status(402)
      .json({message: "Sorry, you need to get more packages to book"})
  }
}

module.exports.unbooking = async (req, res, next) => {
  const userId = req.session.user.id
  const {id, reservations} = req.body
  const objectUserId = mongoose.Types.ObjectId(userId)
  const userReservations = await Reservations.find({lesson: id})
  const trueReservations = userReservations.filter(
    (reservation) => reservation.user == userId
  )

  // we only do that with simulate reservations, is not true.
  if (trueReservations.length == 0) {
    const deleteBook = await Lesson.findByIdAndDelete(id)

    const returnPackage = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {packages: 1},
      },
      {new: true}
    )

    const sumCapacity = await User.findById(id)

    const user = await User.findById(userId)
      .populate("lessons")
      .populate({
        path: "lessons",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "gym",
          model: "Gym",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "classroom",
          model: "Classroom",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "instructor",
          model: "Instructor",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate("reservations")
      .populate({
        path: "reservations",
        populate: {
          path: "lesson",
          model: "Lesson",
        },
      })
      .populate("waitinglists")
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "gym",
            model: "Gym",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "instructor",
            model: "Instructor",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "classroom",
            model: "Classroom",
          },
        },
      })
    Promise.all([deleteBook, returnPackage, sumCapacity, user])
      .then((unreservation) => res.status(201).json(unreservation))
      .catch(next)
  }


  const reservationId = trueReservations[0].id
  const lessonId = trueReservations[0].lesson


  const date = new Date()
  const hours24 = 86400000
  const lesson = await Lesson.findById(lessonId)
  const objectLessonId = mongoose.Types.ObjectId(lessonId)

  if (lesson.date.getTime() - date.getTime() > hours24) {
    const waitingListLesson = await Waitinglist.find({
      lesson: objectLessonId,
    })

    const lessonUsersExceptUserId = lesson.user.filter(
      (user) => user != userId
    )

    const reservationInfo = await Reservations.findById(reservationId)

    const deleteUserFromLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      {
        user: lessonUsersExceptUserId
      },
      {new: true}
    )

    const deleteBook = await Reservations.findByIdAndDelete(reservationId)

    const returnPackage = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {packages: 1},
      },
      {new: true}
    )

    const sumCapacity = await Lesson.findByIdAndUpdate(
      lessonId,
      {
        $inc: {capacity: +1}
      },
      {new: true}
    )

    if (waitingListLesson.length) {
      const userIdWaitingListLesson = waitingListLesson[0].user
      const enoughPackages = await User.findById(userIdWaitingListLesson)
      if (enoughPackages.packages > 0) {
        const getPackage = User.findByIdAndUpdate(
          userId,
          {
            $inc: {packages: -1},
          },
          {new: true}
        )

        const restCapacity = await Lesson.findByIdAndUpdate(
          id,
          {
            $inc: {capacity: -1},
            $push: {user: userIdWaitingListLesson},
          },
          {new: true}
        )

        const deleteFromWaiting = await Waitinglist.findByIdAndDelete(
          waitingListLesson[0].id
        )

        // User.findById(userIdWaitingListLesson).then((user) => {
        //   nodemailer.sendReservationEmail(user.email, user.name)
        // })

        const newReservation = await Reservations.create({
          row: reservationInfo.row,
          column: reservationInfo.seat,
          user: userIdWaitingListLesson,
          lesson: lessonId,
        })


        Promise.all([getPackage, restCapacity, deleteFromWaiting, deleteUserFromLesson, newReservation])
      }
    }

    const user = User.findById(userId)
      .populate("lessons")
      .populate({
        path: "lessons",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "gym",
          model: "Gym",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "classroom",
          model: "Classroom",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "instructor",
          model: "Instructor",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate("reservations")
      .populate({
        path: "reservations",
        populate: {
          path: "lesson",
          model: "Lesson",
        },
      })
      .populate("waitinglists")
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "gym",
            model: "Gym",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "instructor",
            model: "Instructor",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "classroom",
            model: "Classroom",
          },
        },
      })

    Promise.all([deleteBook, returnPackage, sumCapacity, user])
      .then((unreservation) => res.status(201).json(unreservation))
      .catch(next)
  } else {
    return res
      .status(402)
      .json({message: "Sorry, it's too late, next time, be hurry"})
  }
}

module.exports.getFollowersUsers = async (req, res, next) => {
  const followersArr = req.body
  const usersInfoArr = []

  const users = await User.find()

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < followersArr.length; j++)
      if (users[i].id == followersArr[j]) {
        usersInfoArr.push(users[i])
      }
  }

  return res.status(201).json(usersInfoArr)
}

module.exports.waitingList = async (req, res, next) => {
  const userId = req.session.user.id
  const {id} = req.body
  const objectUserId = mongoose.Types.ObjectId(userId)
  const objectLessonId = mongoose.Types.ObjectId(id)

  const allWaitingList = await Waitinglist.find({lesson: id})

  const filteredallWaitingList = allWaitingList.filter(
    (book) => book.user == userId
  )

  const enoughPackages = await User.findById(userId)

  if (filteredallWaitingList.length) {
    return res.status(410).json({
      message: "Sorry, you are in this waiting list",
    })
  } else if (enoughPackages.packages > 0) {
    const addToWaitingList = Waitinglist.create({
      user: objectUserId,
      lesson: objectLessonId,
    })

    const user = await User.findById(userId)
      .populate("lessons")
      .populate({
        path: "lessons",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "gym",
          model: "Gym",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "classroom",
          model: "Classroom",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "instructor",
          model: "Instructor",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate("reservations")
      .populate({
        path: "reservations",
        populate: {
          path: "lesson",
          model: "Lesson",
        },
      })
      .populate("waitinglists")
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "gym",
            model: "Gym",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "instructor",
            model: "Instructor",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "classroom",
            model: "Classroom",
          },
        },
      })

    Promise.all([addToWaitingList, user])
      .then((reservation) => res.status(201).json(reservation))
      .catch(next)
  } else {
    return res
      .status(402)
      .json({
        message:
          "Sorry, you need to get more packages to be in the waitinglist",
      })
  }
}

module.exports.unWaitingList = async (req, res, next) => {
  const userId = req.session.user.id
  const {id} = req.body

  const allWaitingList = await Waitinglist.find({lesson: id})

  const filteredallWaitingList = await allWaitingList.filter(
    (book) => book.user == userId
  )

  if (filteredallWaitingList.length) {
    const deleteToWaitingList = await Waitinglist.findByIdAndDelete(
      filteredallWaitingList[0].id
    )

    const user = await User.findById(userId)
      .populate("lessons")
      .populate({
        path: "lessons",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "gym",
          model: "Gym",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "classroom",
          model: "Classroom",
        },
      })
      .populate({
        path: "lessons",
        populate: {
          path: "instructor",
          model: "Instructor",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .populate("reservations")
      .populate({
        path: "reservations",
        populate: {
          path: "lesson",
          model: "Lesson",
        },
      })
      .populate("waitinglists")
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "gym",
            model: "Gym",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "instructor",
            model: "Instructor",
          }
        },
      })
      .populate({
        path: "waitinglists",
        populate: {
          path: "lesson",
          model: "Lesson",
          populate: {
            path: "classroom",
            model: "Classroom",
          },
        },
      })

    Promise.all([deleteToWaitingList, user])
      .then((unwaitinglist) => {
        res.status(201).json(unwaitinglist)
      })
      .catch(next)
  } else {
    return res.status(402).json({message: "Sorry"})
  }
}


module.exports.updateReservation = async (req, res, next) => {
  const {id} = req.params
  const {
    user,
    lesson,
    row,
    column,
    points,
  } = req.body
  const userId = req.session.user.id

  // this check if the instructor is workind at that time, import instructor from frontend.

  const reservationInfo = await Reservations.findById(id)
  const allReservations = await Reservations.find()


  const sameReservation = allReservations.filter(
    (reservation) => reservation.lesson == id && reservation.row == row && reservation.column == column
  )


  if (sameReservation.length) {
    return res
      .status(409)
      .json({message: "Reservation already working at this time"})
  }

  if (req.session.user.role == "Admin") {
    Reservations.findByIdAndUpdate(id, req.body, {new: true})
      .then((updatedReservation) => {
        res.status(201).json(updatedReservation)
      })
      .catch((error) => next(createError(400, error)))
  } else {
    req.session.destroy()
    res.status(204).json()
  }
}


module.exports.updateOrg = async (req, res, next) => {
  const {id} = req.params
  const {
    name,
    role,
    description,
    url,
    avatar,
    points
  } = req.body
  const userId = req.session.user.id

  // this check if the instructor is workind at that time, import instructor from frontend.

  const orgInfo = await Social.findById(id)
  const allOrgs = await Social.find()


  const sameOrg = allOrgs.filter(
    (org) => org.name == name && orgInfo.id != id
  )


  if (sameOrg.length) {
    return res
      .status(409)
      .json({message: "Org already created at this time"})
  }

  if (req.session.user.role == "Admin") {
    Social.findByIdAndUpdate(id, req.body, {new: true})
      .then((updatedOrg) => {
        res.status(201).json(updatedOrg)
      })
      .catch((error) => next(createError(400, error)))
  } else {
    req.session.destroy()
    res.status(204).json()
  }
}

module.exports.deleteCurrentReservation = async (req, res, next) => {
  const {id} = req.params
  Reservations.findByIdAndDelete(id)
    .then(() => res.status(200).json({message: "Reservation already working at this time"}))
    .catch(next)
}