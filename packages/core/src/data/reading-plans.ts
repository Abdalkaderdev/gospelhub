import { ReadingPlan, DailyReading, ReadingAssignment } from '../types/spiritual-growth';

// Bible in a Year Plan
export const BIBLE_IN_YEAR_PLAN: ReadingPlan = {
  id: 'bible-in-year',
  name: 'Bible in a Year',
  description: 'Read through the entire Bible in 365 days with a balanced mix of Old and New Testament readings.',
  duration: 365,
  totalDays: 365,
  category: 'bible-in-year',
  difficulty: 'intermediate',
  dailyReadings: [
    {
      day: 1,
      date: '2024-01-01',
      readings: [
        { book: 'Genesis', chapter: 1, description: 'The Creation' },
        { book: 'Matthew', chapter: 1, description: 'The Genealogy of Jesus' },
        { book: 'Psalms', chapter: 1, description: 'The Way of the Righteous' }
      ],
      theme: 'New Beginnings',
      reflection: 'As we begin this journey through God\'s Word, let us remember that every new beginning starts with God.'
    },
    {
      day: 2,
      date: '2024-01-02',
      readings: [
        { book: 'Genesis', chapter: 2, description: 'The Garden of Eden' },
        { book: 'Matthew', chapter: 2, description: 'The Visit of the Magi' },
        { book: 'Psalms', chapter: 2, description: 'The Reign of God\'s Anointed' }
      ],
      theme: 'God\'s Perfect Design',
      reflection: 'God created everything with purpose and beauty. His design for our lives is perfect.'
    },
    {
      day: 3,
      date: '2024-01-03',
      readings: [
        { book: 'Genesis', chapter: 3, description: 'The Fall of Man' },
        { book: 'Matthew', chapter: 3, description: 'John the Baptist Prepares the Way' },
        { book: 'Psalms', chapter: 3, description: 'A Morning Prayer for Help' }
      ],
      theme: 'Redemption Needed',
      reflection: 'Even in our fallen state, God provides a way of redemption through Jesus Christ.'
    },
    {
      day: 4,
      date: '2024-01-04',
      readings: [
        { book: 'Genesis', chapter: 4, description: 'Cain and Abel' },
        { book: 'Matthew', chapter: 4, description: 'The Temptation of Jesus' },
        { book: 'Psalms', chapter: 4, description: 'Evening Prayer for Protection' }
      ],
      theme: 'Choices and Consequences',
      reflection: 'Our choices matter. Let us choose to follow God\'s ways and trust in His guidance.'
    },
    {
      day: 5,
      date: '2024-01-05',
      readings: [
        { book: 'Genesis', chapter: 5, description: 'The Descendants of Adam' },
        { book: 'Matthew', chapter: 5, description: 'The Sermon on the Mount' },
        { book: 'Psalms', chapter: 5, description: 'A Prayer for Guidance' }
      ],
      theme: 'Blessed Living',
      reflection: 'Jesus teaches us what it means to live a blessed life according to God\'s kingdom.'
    }
  ],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

// New Testament in 6 Months Plan
export const NEW_TESTAMENT_PLAN: ReadingPlan = {
  id: 'new-testament-6months',
  name: 'New Testament in 6 Months',
  description: 'Focus on the New Testament with daily readings designed to complete it in 6 months.',
  duration: 180,
  totalDays: 180,
  category: 'new-testament',
  difficulty: 'beginner',
  dailyReadings: [
    {
      day: 1,
      date: '2024-01-01',
      readings: [
        { book: 'Matthew', chapter: 1, description: 'The Genealogy of Jesus' },
        { book: 'Matthew', chapter: 2, description: 'The Visit of the Magi' }
      ],
      theme: 'The Birth of the King',
      reflection: 'Jesus came as the promised Messiah, fulfilling centuries of prophecy.'
    },
    {
      day: 2,
      date: '2024-01-02',
      readings: [
        { book: 'Matthew', chapter: 3, description: 'John the Baptist Prepares the Way' },
        { book: 'Matthew', chapter: 4, description: 'The Temptation of Jesus' }
      ],
      theme: 'Preparation and Testing',
      reflection: 'Even Jesus was prepared and tested before beginning His ministry.'
    },
    {
      day: 3,
      date: '2024-01-03',
      readings: [
        { book: 'Matthew', chapter: 5, description: 'The Beatitudes' },
        { book: 'Matthew', chapter: 6, description: 'Teaching on Prayer and Fasting' }
      ],
      theme: 'The Kingdom of Heaven',
      reflection: 'Jesus reveals what life in God\'s kingdom looks like.'
    }
  ],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

// Psalms & Proverbs Plan
export const PSALMS_PROVERBS_PLAN: ReadingPlan = {
  id: 'psalms-proverbs',
  name: 'Psalms & Proverbs',
  description: 'Daily wisdom from Psalms and Proverbs for spiritual growth and practical living.',
  duration: 90,
  totalDays: 90,
  category: 'psalms-proverbs',
  difficulty: 'beginner',
  dailyReadings: [
    {
      day: 1,
      date: '2024-01-01',
      readings: [
        { book: 'Psalms', chapter: 1, description: 'The Way of the Righteous' },
        { book: 'Proverbs', chapter: 1, description: 'The Beginning of Knowledge' }
      ],
      theme: 'Wisdom and Righteousness',
      reflection: 'True wisdom begins with the fear of the Lord and leads to righteous living.'
    },
    {
      day: 2,
      date: '2024-01-02',
      readings: [
        { book: 'Psalms', chapter: 2, description: 'The Reign of God\'s Anointed' },
        { book: 'Proverbs', chapter: 2, description: 'The Value of Wisdom' }
      ],
      theme: 'God\'s Sovereignty',
      reflection: 'God is in control, and His wisdom guides those who seek it.'
    },
    {
      day: 3,
      date: '2024-01-03',
      readings: [
        { book: 'Psalms', chapter: 3, description: 'A Morning Prayer for Help' },
        { book: 'Proverbs', chapter: 3, description: 'Trust in the Lord' }
      ],
      theme: 'Trust and Dependence',
      reflection: 'When we trust in the Lord with all our heart, He directs our paths.'
    }
  ],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

export const READING_PLANS: ReadingPlan[] = [
  BIBLE_IN_YEAR_PLAN,
  NEW_TESTAMENT_PLAN,
  PSALMS_PROVERBS_PLAN
];

// Helper function to get plan by ID
export const getReadingPlan = (id: string): ReadingPlan | undefined => {
  return READING_PLANS.find(plan => plan.id === id);
};

// Helper function to get all plans
export const getAllReadingPlans = (): ReadingPlan[] => {
  return READING_PLANS;
};

// Helper function to get plans by category
export const getReadingPlansByCategory = (category: string): ReadingPlan[] => {
  return READING_PLANS.filter(plan => plan.category === category);
};