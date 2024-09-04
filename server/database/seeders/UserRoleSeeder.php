<?php

namespace Database\Seeders;

use App\Models\UserRole;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UserRole::create([
            'role' => 0,
            'name' => 'admin',
        ]);
        UserRole::create([
            'role' => 1,
            'name' => 'user',
        ]);
    }
}
