import { Product } from '@/types/product'

export const products: Product[] = [
  {
    id: '1',
    name: 'Klassisk Sauerkraut',
    description: 'Vår tradisjonelle sauerkraut laget av norsk hvitløk og havsalt. Fermentert i 4 uker for optimal smak og probiotika.',
    price: 89,
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop',
    category: 'Klassisk',
    inStock: true,
    weight: '500g',
    ingredients: ['Norsk hvitløk', 'Havsalt', 'Naturlige melkesyrebakterier']
  },
  {
    id: '2',
    name: 'Krydret Sauerkraut',
    description: 'Sauerkraut med en spennende blanding av karve, pepper og dill. Perfekt til grillmat og tradisjonelle retter.',
    price: 99,
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&h=500&fit=crop',
    category: 'Krydret',
    inStock: true,
    weight: '500g',
    ingredients: ['Norsk hvitløk', 'Havsalt', 'Karve', 'Pepper', 'Dill']
  },
  {
    id: '3',
    name: 'Rødkål Sauerkraut',
    description: 'Vakker lilla sauerkraut laget av norsk rødkål. Rik på antioksidanter og har en mild, søtlig smak.',
    price: 109,
    image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=500&h=500&fit=crop',
    category: 'Premium',
    inStock: true,
    weight: '500g',
    ingredients: ['Norsk rødkål', 'Havsalt', 'Naturlige melkesyrebakterier']
  },
  {
    id: '4',
    name: 'Ingefær & Gulrot Sauerkraut',
    description: 'En moderne vri på klassikeren med fersk ingefær og søte gulrøtter. Perfekt for dem som liker litt ekstra smak.',
    price: 119,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&h=500&fit=crop',
    category: 'Premium',
    inStock: true,
    weight: '500g',
    ingredients: ['Norsk hvitløk', 'Gulrøtter', 'Fersk ingefær', 'Havsalt']
  },
  {
    id: '5',
    name: 'Kimchi-Inspirert Sauerkraut',
    description: 'Norsk-koreansk fusjon med chili, hvitløk og ingefær. Sterk og smakfull - ikke for sarte sjeler!',
    price: 129,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=500&fit=crop',
    category: 'Spesial',
    inStock: true,
    weight: '500g',
    ingredients: ['Norsk hvitløk', 'Chili', 'Hvitløk', 'Ingefær', 'Havsalt']
  },
  {
    id: '6',
    name: 'Økologisk Sauerkraut',
    description: 'Laget av 100% økologisk norsk kål. Sertifisert økologisk og fermentert med tradisjonelle metoder.',
    price: 139,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop',
    category: 'Økologisk',
    inStock: true,
    weight: '500g',
    ingredients: ['Økologisk norsk hvitløk', 'Økologisk havsalt']
  }
]