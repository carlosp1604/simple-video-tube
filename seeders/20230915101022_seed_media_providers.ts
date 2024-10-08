import { Knex } from 'knex'

/* eslint max-len: 0 */
export async function seed (knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex('media_providers').insert([
    { id: '2fef1a77-a1f8-42a3-9293-437a6f4fc5cc', name: 'Youtube', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png?20220706172052', advertising_level: 1, download_speed: 0, free_downloads_day: 0, delay_between_downloads: 0, ref_url: 'https://youtube.com?ref=someref', payment_required: true, multi_quality: true, max_resolution: 2160 },
    { id: 'd460ba6c-5b2e-4cc9-a09e-eda5d5a7e12c', name: 'Vimeo', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Vimeo_Logo.svg/2560px-Vimeo_Logo.svg.png', advertising_level: 4, download_speed: 0, free_downloads_day: 0, delay_between_downloads: 0, ref_url: 'https://vimeo.com?ref=someref', payment_required: false, multi_quality: true, max_resolution: 1080 },
    { id: '0a635277-c262-4777-8833-caa37e6ec1a8', name: 'DailyMotion', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Logo_dailymotion.png', advertising_level: 2, download_speed: 4, free_downloads_day: 2, delay_between_downloads: 2, ref_url: 'https://dailymotion.com?ref=someref', payment_required: false, multi_quality: true, max_resolution: 720 },
    { id: 'ab535237-2262-4763-2443-dfec1a6ec1b9', name: 'Direct', logo_url: '/img/app-logo.png', advertising_level: 0, download_speed: 9, free_downloads_day: 65535, delay_between_downloads: 0, ref_url: 'https://mydomain.com?ref=someref', payment_required: false, multi_quality: false, max_resolution: 2160 },
  ])
}
