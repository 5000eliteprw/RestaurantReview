import {DateTime} from 'luxon'
import {User, emptyUser} from '../user/model'
import {Restaurant, emptyRestaurant} from '../restaurant/model'

export type Review = {
  id: number
  user: User
  restaurant: Restaurant
  rating: number
  date_visited: string
  comment: string
  reply?: string
}

export const emptyReview: Review = {
  id: -1,
  user: emptyUser,
  restaurant: emptyRestaurant,
  rating: 0,
  date_visited: DateTime.local().toISO(),
  comment: '',
}
