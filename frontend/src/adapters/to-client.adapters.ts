import { UserType } from '../const';
import { Comment, Offer } from '../types/types';
import { CommentRDO } from './dto/comments/rdo/comment.rdo';
import { OfferDetailRDO } from './dto/offer/rdo/offer-detail.rdo';
import { OffersListItemRDO } from './dto/offer/rdo/offers-list-item.rdo';

export function adaptOffersToClient(data: OffersListItemRDO[]): Offer[] {
  return data.map((offer) => ({
    id: offer.id,
    price: offer.price,
    rating: 0,
    title: offer.name,
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    city: {
      name: offer.city,
      location: {
        latitude: 0,
        longitude: 0,
      },
    },
    location: {
      latitude: 0,
      longitude: 0
    },
    previewImage: offer.previewImage,
    type: offer.type,
    bedrooms: 0,
    description: '',
    goods: [],
    host: {
      name: '',
      avatarUrl: '',
      type: UserType.Pro,
      email: '',
    },
    images: [],
    maxAdults: 0,
  }));
}

export function adaptOfferDetailToClient(data: OfferDetailRDO): Offer {
  return {
    id: data.id,
    price: data.price,
    rating: data.rating,
    title: data.name,
    isPremium: data.isPremium,
    isFavorite: data.isFavorite,
    city: {
      name: data.city,
      location: {
        latitude: Number(data.coordinates.latitude),
        longitude: Number(data.coordinates.longitude),
      },
    },
    location: {
      latitude: Number(data.coordinates.latitude),
      longitude: Number(data.coordinates.longitude)
    },
    previewImage: data.previewImage,
    type: data.type,
    bedrooms: data.rooms,
    description: data.description,
    goods: data.facilities,
    host: {
      name: data.user.name,
      avatarUrl: data.user.avatarUrl,
      type: data.user.isPro ? UserType.Pro : UserType.Regular,
      email: data.user.email,
    },
    images: data.images,
    maxAdults: data.guests,
  };
}

export function adaptCommentsToClient(data: CommentRDO[]): Comment[] {
  return data.map((comment) => ({
    id: comment.id,
    comment: comment.text,
    date: comment.date,
    rating: comment.rating,
    user: {
      name: 'Test',
      avatarUrl: 'http://localhost:8000/static/default-user-avatar.jpg',
      type: UserType.Pro,
      email: `${comment.userId}`,
    },
  }));
}
