import {Review} from '../review/model'
import {User, emptyUser} from '../user/model'

export type Restaurant = {
  id: number
  name: string
  background_image_url: string
  owner: User
  avg_rating: number
  highest_rating: number
  lowest_rating: number
  reviews?: Review[]
}

export const emptyRestaurant: Restaurant = {
  id: -1,
  name: '',
  background_image_url: '',
  owner: emptyUser,
  avg_rating: 0.0,
  highest_rating: 0.0,
  lowest_rating: 0.0,
}
