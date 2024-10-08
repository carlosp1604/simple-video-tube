import { Knex } from 'knex'

/* eslint max-len: 0 */
export async function seed (knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('actors').del()

  // Inserts seed entries
  await knex('actors').insert([
    { id: '1bcd0b5c-cdd0-4484-9c6c-4724e8081c96', slug: 'victor-santana', name: 'Victor Santana', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 'c03de5ea-c024-47c7-b5f6-68047503134a', slug: 'rosario-vidal', name: 'Rosario Vidal', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 'cb08adfb-fd76-438e-a582-219b62ff6dcd', slug: 'maria-elena', name: 'María Elena Torres', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '9d6f221a-05f7-4545-bfb8-9a178708421d', slug: 'sara-herrero', name: 'Sara Herrera', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '06362d28-873f-464d-a0fc-a05093f07bc3', slug: 'alberto-nuez', name: 'Alberto Nuñez', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '8079e5fd-da6d-4aa7-8c9e-d73baa975ff9', slug: 'juan-carlos', name: 'Juan Carlos Torres', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '351deea5-a66e-4cb2-99fa-0e33b9617bf2', slug: 'ruben-benitez', name: 'Ruben Benitez', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '1c6b056d-4ad2-4659-b2db-796d274f9913', slug: 'veronica-alonso', name: 'Verónica Alonso', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '49697497-0f32-442a-8895-aed02c849375', slug: 'amparo-carmona', name: 'Amparo Carmona', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 'e91cb6c4-957f-4966-b959-fc0b988c66b8', slug: 'aitor-sanchez', name: 'Aitor Sanchez', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 'ef37b5b8-f382-409a-a38f-3b2a09abdbc7', slug: 'philip-phillips', name: 'Philip Phillips', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 'fd28fdb2-a431-4480-8b01-48dce4e4c15a', slug: 'victoria-smith', name: 'Victoria Smith', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '8354df3a-7adf-4528-b3b0-db35788b8739', slug: 'gavin-fuller', name: 'Gavin Fuller', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 'da26c4f6-8d97-466f-aaf0-aa98e258750e', slug: 'dakota-lewis', name: 'Dakota Lewis', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '8dbf5cae-393e-478f-b44b-e7b9d0e67e2e', slug: 'cayden-reed', name: 'Cayden Reed', image_url: 'https://images.pexels.com/photos/666839/pexels-photo-666839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  ])
}
