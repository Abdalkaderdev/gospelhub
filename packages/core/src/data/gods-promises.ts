import { PromiseCategory, GodsPromise, PromiseVerse } from '../types/spiritual-growth';

// Promise Categories
export const PROMISE_CATEGORIES: PromiseCategory[] = [
  {
    id: 'healing',
    name: 'Healing',
    description: 'God\'s promises for physical, emotional, and spiritual healing',
    color: 'bg-green-100 text-green-800',
    icon: '🏥'
  },
  {
    id: 'provision',
    name: 'Provision',
    description: 'God\'s promises for daily needs and abundance',
    color: 'bg-blue-100 text-blue-800',
    icon: '💰'
  },
  {
    id: 'peace',
    name: 'Peace',
    description: 'God\'s promises for peace in all circumstances',
    color: 'bg-purple-100 text-purple-800',
    icon: '🕊️'
  },
  {
    id: 'strength',
    name: 'Strength',
    description: 'God\'s promises for strength and endurance',
    color: 'bg-orange-100 text-orange-800',
    icon: '💪'
  },
  {
    id: 'guidance',
    name: 'Guidance',
    description: 'God\'s promises for divine direction and wisdom',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '🧭'
  },
  {
    id: 'protection',
    name: 'Protection',
    description: 'God\'s promises for safety and security',
    color: 'bg-red-100 text-red-800',
    icon: '🛡️'
  },
  {
    id: 'love',
    name: 'Love',
    description: 'God\'s promises of unconditional love and acceptance',
    color: 'bg-pink-100 text-pink-800',
    icon: '❤️'
  },
  {
    id: 'hope',
    name: 'Hope',
    description: 'God\'s promises for hope and future blessings',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🌟'
  }
];

// God's Promises Database
export const GODS_PROMISES: GodsPromise[] = [
  {
    id: 'healing-1',
    title: 'Healing for the Brokenhearted',
    description: 'God promises to heal our emotional wounds and broken hearts',
    category: 'healing',
    verses: [
      {
        reference: 'Psalm 147:3',
        text: 'He heals the brokenhearted and binds up their wounds.',
        book: 'Psalms',
        chapter: 147,
        verse: 3
      }
    ],
    application: 'When you feel broken or wounded, remember that God is near to heal your heart. His love is a balm for every hurt.',
    prayer: 'Lord, thank You for Your promise to heal my broken heart. Help me to trust in Your healing power and find comfort in Your presence.',
    isClaimed: false,
    isFavorite: false
  },
  {
    id: 'provision-1',
    title: 'God Will Supply All Your Needs',
    description: 'God promises to provide for all our needs according to His riches',
    category: 'provision',
    verses: [
      {
        reference: 'Philippians 4:19',
        text: 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.',
        book: 'Philippians',
        chapter: 4,
        verse: 19
      }
    ],
    application: 'When you worry about finances or daily needs, remember that God is your provider. He knows what you need and will supply it in His perfect timing.',
    prayer: 'Father, I trust in Your promise to provide for all my needs. Help me to rely on You and not worry about tomorrow.',
    isClaimed: false,
    isFavorite: false
  },
  {
    id: 'peace-1',
    title: 'Peace That Surpasses Understanding',
    description: 'God promises peace that goes beyond human comprehension',
    category: 'peace',
    verses: [
      {
        reference: 'Philippians 4:7',
        text: 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
        book: 'Philippians',
        chapter: 4,
        verse: 7
      }
    ],
    application: 'In times of anxiety and worry, God offers a peace that doesn\'t make sense to the world. This peace guards our hearts and minds.',
    prayer: 'Lord, I claim Your promise of peace. Guard my heart and mind with Your peace that surpasses all understanding.',
    isClaimed: false,
    isFavorite: false
  },
  {
    id: 'strength-1',
    title: 'Strength for the Weary',
    description: 'God promises to give strength to those who are tired and weak',
    category: 'strength',
    verses: [
      {
        reference: 'Isaiah 40:31',
        text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
        book: 'Isaiah',
        chapter: 40,
        verse: 31
      }
    ],
    application: 'When you feel weak and weary, God promises to renew your strength. Those who hope in Him will soar like eagles.',
    prayer: 'Heavenly Father, I place my hope in You. Renew my strength and help me to soar on wings like eagles.',
    isClaimed: false,
    isFavorite: false
  },
  {
    id: 'guidance-1',
    title: 'God Will Direct Your Paths',
    description: 'God promises to guide and direct our steps when we trust in Him',
    category: 'guidance',
    verses: [
      {
        reference: 'Proverbs 3:5-6',
        text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
        book: 'Proverbs',
        chapter: 3,
        verse: 5
      }
    ],
    application: 'When you need direction in life, trust in the Lord completely. He will make your paths straight and guide you in the right way.',
    prayer: 'Lord, I trust in You with all my heart. Please direct my paths and make my way straight according to Your will.',
    isClaimed: false,
    isFavorite: false
  },
  {
    id: 'protection-1',
    title: 'God is Your Refuge and Fortress',
    description: 'God promises to be our protection and safe place',
    category: 'protection',
    verses: [
      {
        reference: 'Psalm 91:2',
        text: 'I will say of the Lord, "He is my refuge and my fortress, my God, in whom I trust."',
        book: 'Psalms',
        chapter: 91,
        verse: 2
      }
    ],
    application: 'In times of danger or fear, God is your refuge and fortress. You can trust in His protection and find safety in His presence.',
    prayer: 'Lord, You are my refuge and fortress. I trust in Your protection and find safety in Your presence.',
    isClaimed: false,
    isFavorite: false
  },
  {
    id: 'love-1',
    title: 'Nothing Can Separate Us from God\'s Love',
    description: 'God\'s love is unconditional and nothing can separate us from it',
    category: 'love',
    verses: [
      {
        reference: 'Romans 8:38-39',
        text: 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.',
        book: 'Romans',
        chapter: 8,
        verse: 38
      }
    ],
    application: 'No matter what you face in life, nothing can separate you from God\'s love. His love is constant, unconditional, and eternal.',
    prayer: 'Thank You, Lord, for Your unshakeable love. Help me to remember that nothing can separate me from Your love in Christ Jesus.',
    isClaimed: false,
    isFavorite: false
  },
  {
    id: 'hope-1',
    title: 'Plans to Prosper and Give Hope',
    description: 'God has good plans for your future that give hope',
    category: 'hope',
    verses: [
      {
        reference: 'Jeremiah 29:11',
        text: 'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future.',
        book: 'Jeremiah',
        chapter: 29,
        verse: 11
      }
    ],
    application: 'Even in difficult times, God has good plans for your future. His plans are to prosper you and give you hope, not to harm you.',
    prayer: 'Lord, I trust in Your good plans for my life. Thank You for the hope and future You have prepared for me.',
    isClaimed: false,
    isFavorite: false
  }
];

// Helper functions
export const getPromiseCategories = (): PromiseCategory[] => {
  return PROMISE_CATEGORIES;
};

export const getCategoryById = (id: string): PromiseCategory | undefined => {
  return PROMISE_CATEGORIES.find(category => category.id === id);
};

export const getAllPromises = (): GodsPromise[] => {
  return GODS_PROMISES;
};

export const getPromisesByCategory = (categoryId: string): GodsPromise[] => {
  return GODS_PROMISES.filter(promise => promise.category === categoryId);
};

export const getRandomPromise = (): GodsPromise => {
  const randomIndex = Math.floor(Math.random() * GODS_PROMISES.length);
  return GODS_PROMISES[randomIndex];
};

export const searchPromises = (query: string): GodsPromise[] => {
  const lowercaseQuery = query.toLowerCase();
  return GODS_PROMISES.filter(promise => 
    promise.title.toLowerCase().includes(lowercaseQuery) ||
    promise.description.toLowerCase().includes(lowercaseQuery) ||
    promise.application.toLowerCase().includes(lowercaseQuery)
  );
};