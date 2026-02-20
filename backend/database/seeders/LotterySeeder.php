<?php

namespace Database\Seeders;

use App\Models\Lottery;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LotterySeeder extends Seeder
{
    /**
     * Seed 5 premium lottery tickets with 3D-style image placeholders.
     * Images use placehold.co with vivid gradient-style colours to simulate
     * the 3D rendered look until real assets are uploaded via the admin panel.
     */
    public function run(): void
    {
        $lotteries = [
            [
                'title'         => 'Golden Jackpot Mega Draw',
                'slug'          => 'golden-jackpot-mega-draw',
                'description'   => 'The ultimate lottery experience. Win life-changing riches with our flagship Golden Jackpot draw. Only 500 exclusive tickets available.',
                'image'         => 'https://placehold.co/800x600/FFD700/1a1a2e?text=Golden+Jackpot&font=raleway',
                'price'         => 49.99,
                'draw_date'     => now()->addDays(30),
                'total_tickets' => 500,
                'tickets_sold'  => 0,
                'status'        => 'active',
            ],
            [
                'title'         => 'Platinum Elite Raffle',
                'slug'          => 'platinum-elite-raffle',
                'description'   => 'Exclusive platinum-tier raffle featuring luxury prizes including sports cars, watches, and exotic travel packages.',
                'image'         => 'https://placehold.co/800x600/E5E4E2/1a1a2e?text=Platinum+Elite&font=raleway',
                'price'         => 99.99,
                'draw_date'     => now()->addDays(45),
                'total_tickets' => 250,
                'tickets_sold'  => 0,
                'status'        => 'active',
            ],
            [
                'title'         => 'Sapphire Dream Lottery',
                'slug'          => 'sapphire-dream-lottery',
                'description'   => 'Chase the sapphire dream — weekly draws with guaranteed winners and a rolling jackpot that grows with every unsold ticket.',
                'image'         => 'https://placehold.co/800x600/0F52BA/ffffff?text=Sapphire+Dream&font=raleway',
                'price'         => 19.99,
                'draw_date'     => now()->addDays(7),
                'total_tickets' => 2000,
                'tickets_sold'  => 0,
                'status'        => 'active',
            ],
            [
                'title'         => 'Ruby Fortune Bonanza',
                'slug'          => 'ruby-fortune-bonanza',
                'description'   => 'Strike ruby-red fortune in our limited-edition holiday bonanza. Top prize is a fully-furnished luxury apartment.',
                'image'         => 'https://placehold.co/800x600/9B111E/ffffff?text=Ruby+Fortune&font=raleway',
                'price'         => 74.99,
                'draw_date'     => now()->addDays(60),
                'total_tickets' => 1000,
                'tickets_sold'  => 0,
                'status'        => 'active',
            ],
            [
                'title'         => 'Emerald VIP Grand Prix',
                'slug'          => 'emerald-vip-grand-prix',
                'description'   => 'VIP access, green-carpet treatment, and the grand prize of a supercar. Our most prestigious draw of the year.',
                'image'         => 'https://placehold.co/800x600/50C878/1a1a2e?text=Emerald+VIP&font=raleway',
                'price'         => 149.99,
                'draw_date'     => now()->addDays(90),
                'total_tickets' => 100,
                'tickets_sold'  => 0,
                'status'        => 'active',
            ],
        ];

        foreach ($lotteries as $data) {
            Lottery::firstOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }
    }
}
