import { Knex } from 'knex'

/* eslint max-len: 0 */
export async function seed (knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('translations').del()

  // Inserts seed entries
  await knex('translations').insert([
    { tr: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', slug: 'avoid-top-10-mistakes-made-by-beginning-tube-video', title: 'Avoid The Top 10 Mistakes Made By Beginning TUBE VIDEO', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '1d27216d-1a91-4ee7-b4a5-ac56cf89d014' },
    { id: 'bd57216d-1a91-4ee7-b4a5-ac56cf89d011', slug: 'believing-these-5-myths-about-test-keeps-you-from-growing', title: 'Believing These 5 Myths About Test Keeps You From Growing', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d015' },
    { id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', slug: 'dont-waste-time-5-facts-until-you-reach-your-test', title: 'Don\'t Waste Time! 5 Facts Until You Reach Your Test', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d015' },
    { id: 'dd57216d-1a91-4ee7-b4a5-ac56cf89d013', slug: 'guaranteed-no-stress-testing', title: 'Guaranteed No Stress TESTING', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '2d57216d-1a91-4ee7-b4a5-ac56cf89d018' },
    { id: 'ed57216d-1a91-4ee7-b4a5-ac56cf89d014', slug: '3-ways-twitter-destroyed-my-testing-without-me-noticing', title: '3 Ways Twitter Destroyed My TESTING Without Me Noticing', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d015' },
    { id: 'fd57216d-1a91-4ee7-b4a5-ac56cf89d015', slug: 'what-you-should-have-asked-your-teachers-about-testing', title: 'What You Should Have Asked Your Teachers About TESTING', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d015' },
    { id: 'd57216d1-1a91-4ee7-b4a5-ac56cf89d016', slug: 'secrets-to-testing-–-even-in-this-down-economy', title: 'Secrets To TESTING – Even In This Down Economy', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', producer_id: '4d57216d-1a91-4ee7-b4a5-ac56cf89d013' },
    { id: 'ad57216d-1a91-4ee7-b4a5-ac56cf89d017', slug: 'fall-in-love-with-testing', title: 'Fall In Love With TESTING', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '4d57216d-1a91-4ee7-b4a5-ac56cf89d013' },
    { id: '3d57216d-1a91-4ee7-b4a5-ac56cf89d018', slug: 'knowing-these-8-secrets-will-make-your-testing-look-amazing', title: 'Knowing These 8 Secrets Will Make Your Testing Look Amazing', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '1e57216d-1a91-4ee7-b4a5-ac56cf89d011' },
    { id: '2d57216d-1a91-4ee7-b4a5-ac56cf89d019', slug: 'testing-on-a-budget-8-tips-from-the-great-depression', title: 'Testing On A Budget: 8 Tips From The Great Depression', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '7e57216d-1a91-4ee7-b4a5-ac56cf89d010' },
    { id: '4d57216d-1a91-4ee7-b4a5-ac56cf89d020', slug: 'master-the-art-of-testing-with-these-8-tips', title: 'Master The Art Of Testing With These 8 Tips', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '7e57216d-1a91-4ee7-b4a5-ac56cf89d010' },
    { id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d021', slug: 'testing-awards-8-reasons-why-they-dont-work-and-what-you-can-do-about-it', title: 'Testing Awards: 8 Reasons Why They Don\'t Work & What You Can Do About It', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '7e57216d-1a91-4ee7-b4a5-ac56cf89d010' },
    { id: '6d57216d-1a91-4ee7-b4a5-ac56cf89d022', slug: 'avoid-the-top-10-mistakes-made-by-beginning-tube-video', title: 'Avoid The Top 10 Mistakes Made By Beginning TUBE VIDEO', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', producer_id: '7e57216d-1a91-4ee7-b4a5-ac56cf89d010' },
    { id: '7d57216d-1a91-4ee7-b4a5-ac56cf89d023', slug: 'master-the-art-of-testing-with-these-8-tips-2', title: 'Master The Art Of Testing With These 8 Tips', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '2d57216d-1a91-4ee7-b4a5-ac56cf89d018' },
    { id: '8d57216d-1a91-4ee7-b4a5-ac56cf89d024', slug: '8-places-to-get-deals-on-testing', title: '8 Places To Get Deals On Testing', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '2d57216d-1a91-4ee7-b4a5-ac56cf89d018' },
    { id: '9d57216d-1a91-4ee7-b4a5-ac56cf89d025', slug: '8-amazing-testing-hacks', title: '8 Amazing Testing Hacks', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: null },
    { id: 'fa57216d-1a91-4ee7-b4a5-ac56cf89d026', slug: '8-awesome-tips-about-testing-from-unlikely-sources', title: '8 Awesome Tips About Testing From Unlikely Sources', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: null },
    { id: 'fb57216d-1a91-4ee7-b4a5-ac56cf89d027', slug: '8-creative-ways-you-can-improve-your-testing', title: '8 Creative Ways You Can Improve Your Testing', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', producer_id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d015' },
    { id: 'fc57216d-1a91-4ee7-b4a5-ac56cf89d028', slug: '8-easy-steps-to-more-testing-sales', title: '8 Easy Steps To More Testing Sales', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d015' },
    { id: 'fd57216d-1a91-4ee7-b4a5-ac56cf89d029', slug: '8-effective-ways-to-get-more-out-of-testing', title: '8 Effective Ways To Get More Out Of Testing', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: null },
    { id: 'fe57216d-1a91-4ee7-b4a5-ac56cf89d030', slug: '8-enticing-ways-to-improve-your-testing-skills', title: '8 Enticing Ways To Improve Your Testing Skills', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: null },
    { id: 'ff57216d-1a91-4ee7-b4a5-ac56cf89d031', slug: '8-examples-of-testing', title: '8 Examples Of Testing', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: null },
    { id: 'fda7216d-1a91-4ee7-b4a5-ac56cf89d032', slug: 'best-testing-android-apps', title: 'Best Testing Android Apps', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', producer_id: null },
    { id: 'fdb7216d-1a91-4ee7-b4a5-ac56cf89d033', slug: 'best-testing-tips-you-will-read-this-year', title: 'Best Testing Tips You Will Read This Year', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', producer_id: '2d57216d-1a91-4ee7-b4a5-ac56cf89d018' },
    { id: 'fdc7216d-1a91-4ee7-b4a5-ac56cf89d034', slug: 'best-80-tips-for-testing', title: 'Best 80 Tips For Testing', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', producer_id: 'ad57216d-1a91-4ee7-b4a5-ac56cf89d017' },
    { id: 'fdd7216d-1a91-4ee7-b4a5-ac56cf89d035', slug: 'should-fixing-testing-take-80-steps', title: 'Should Fixing Testing Take 80 Steps?', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', producer_id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d015' },
    { id: 'fde7216d-1a91-4ee7-b4a5-ac56cf89d036', slug: 'the-a-z-of-testing', title: 'The A - Z Of Testing', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d015' },
    { id: 'fdf7216d-1a91-4ee7-b4a5-ac56cf89d037', slug: 'the-next-80-things-to-immediately-do-about-testing', title: 'The Next 80 Things To Immediately Do About Testing', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '1d27216d-1a91-4ee7-b4a5-ac56cf89d014' },
    { id: 'fd07216d-1a91-4ee7-b4a5-ac56cf89d038', slug: 'the-ultimate-guide-to-testing', title: 'The Ultimate Guide To Testing', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '1d27216d-1a91-4ee7-b4a5-ac56cf89d014' },
    { id: 'fd17216d-1a91-4ee7-b4a5-ac56cf89d039', slug: 'top-80-funny-testing-quotes', title: 'Top 80 Funny Testing Quotes', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', published_at: randomDate(), producer_id: '1d27216d-1a91-4ee7-b4a5-ac56cf89d014' },
  ])
}
