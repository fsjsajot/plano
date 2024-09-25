<?php

use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;

it('should return the authenticated user', function() {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();

    $this->getJson("/api/user")
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($user) {
            $json->has('data')
                ->where('data.id', $user->id)
                ->where('data.name', $user->name)
                ->where('data.email', $user->email);
        });
});