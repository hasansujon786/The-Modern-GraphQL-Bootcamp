const users = [
  { id: '1', name: 'Hasan', email: 'hasan@ex.com', age: 20, posts: ['1', '2'] },
  { id: '2', name: 'Kamal', email: 'kuddus@ex.com', posts: ['3'] },
  { id: '3', name: 'Sokin', email: 'sokina@ex.com' }
]

const posts = [
  {
    id: '1',
    title: 'twinkle twinkle',
    body: 'Twinklw twinkle little star, How I wonder what you are!',
    published: true,
    auther: '1'
  },
  {
    id: '2',
    title: 'Johny Johny',
    body: `Johny Johny. Yes papa! Eating suger? No papa. Telling lies? No papa. Open your mouth. Ha Ha Ha.`,
    published: false,
    auther: '1'
  },
  {
    id: '3',
    title: 'Hmumpty Dumpty',
    body: `Hmumpty Dumpty sat on a wall. Hmumpty Dumpty had a great fall. All the king's hourses and all the king's men could not put Hmumpty Dumpty togather again.`,
    published: true,
    auther: '2'
  }
]

const comments = [
  { id: '1', text: 'amazing post 1', auther: '2', post: '1' },
  { id: '2', text: 'amazing post 2', auther: '2', post: '2' },
  { id: '3', text: 'amazing post 3', auther: '1', post: '3' },
  { id: '4', text: 'amazing post 4', auther: '1', post: '3' }
]

const db = { users, posts, comments }

export { db as default }
