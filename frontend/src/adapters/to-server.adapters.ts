import { CommentAuth, NewOffer, UserRegister } from '../types/types';
import { CreateCommentDTO } from './dto/comments/dto/create-comment.dto';
import { CreateOfferDTO } from './dto/offer/dto/create-offer.dto';
import { CreateUserDTO } from './dto/user/dto/create-user.dto';
import { getISODate } from './utils/common';

export function adaptUserToServer(data: UserRegister): CreateUserDTO {
  return {
    name: data.name,
    email: data.email,
    password: data.password,
    avatarUrl: `${data.avatar?.name}`,
    isPro: Boolean(data.type),
    favoriteOffers: []
  };
}

export function adaptOfferToServer(data: NewOffer): CreateOfferDTO {
  return {
    name: data.title,
    description: data.description,
    date: getISODate(),
    city: data.city.name,
    previewImage: data.previewImage,
    images: data.images,
    isPremium: data.isPremium,
    isFavorite: false,
    rating: 1,
    type: data.type,
    rooms: data.bedrooms,
    guests: data.maxAdults,
    price: data.price,
    facilities: data.goods,
    commentCount: 0,
    coordinates: {
      latitude: String(data.location.latitude),
      longitude: String(data.location.longitude),
    },
  };
}

export function adaptCommentToServer(data: CommentAuth): CreateCommentDTO {
  return {
    offerId: data.id,
    text: data.comment,
    rating: data.rating
  };
}
