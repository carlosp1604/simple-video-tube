import { Knex } from 'knex'

/* eslint max-len: 0 */
export async function seed (knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('reactions').del()

  // Inserts seed entries
  await knex('reactions').insert([
    { reactionable_type: 'Post', reactionable_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'dd57216d-1a91-4ee7-b4a5-ac56cf89d013', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'ed57216d-1a91-4ee7-b4a5-ac56cf89d014', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'fd57216d-1a91-4ee7-b4a5-ac56cf89d015', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'd57216d1-1a91-4ee7-b4a5-ac56cf89d016', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'ad57216d-1a91-4ee7-b4a5-ac56cf89d017', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: '2d57216d-1a91-4ee7-b4a5-ac56cf89d019', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: '4d57216d-1a91-4ee7-b4a5-ac56cf89d020', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d021', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: '6d57216d-1a91-4ee7-b4a5-ac56cf89d022', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: '8d57216d-1a91-4ee7-b4a5-ac56cf89d024', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: '9d57216d-1a91-4ee7-b4a5-ac56cf89d025', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'fa57216d-1a91-4ee7-b4a5-ac56cf89d026', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'fc57216d-1a91-4ee7-b4a5-ac56cf89d028', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'fd57216d-1a91-4ee7-b4a5-ac56cf89d029', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'fe57216d-1a91-4ee7-b4a5-ac56cf89d030', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'ff57216d-1a91-4ee7-b4a5-ac56cf89d031', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'fda7216d-1a91-4ee7-b4a5-ac56cf89d032', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'fdb7216d-1a91-4ee7-b4a5-ac56cf89d033', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'fdc7216d-1a91-4ee7-b4a5-ac56cf89d034', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'fde7216d-1a91-4ee7-b4a5-ac56cf89d036', user_ip: '192.168.100.1', reaction_type: 'like' },
    { reactionable_type: 'Post', reactionable_id: 'fdf7216d-1a91-4ee7-b4a5-ac56cf89d037', user_ip: '192.168.100.1', reaction_type: 'like' },
  ])
}
