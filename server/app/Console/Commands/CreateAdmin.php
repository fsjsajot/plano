<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class CreateAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create super admin';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $exists = User::where('user_role_id', 1)->get()->isNotEmpty();

        if ($exists) {
            $this->fail('Admin is already created.');
        }

        $name = $this->askWithValidation('Name of the admin', ['required'], 'name');
        $email = $this->askWithValidation('Email address of the admin', ['email', 'required'], 'email');
        $password = $this->askWithValidation('Password of the admin', ['required', Password::defaults()], 'password', 'secret');

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'user_role_id' => 1
        ]);

        $this->info('Admin account created.');
    }

    // snippet from https://gist.github.com/ryangjchandler/1c579774cc2c2c5fda421f3374e4a01c
    public function askWithValidation(
        string $message,
        array $rules = [],
        string $name = 'value',
        string $promptType = 'ask'
    ) {
        $answer = $promptType == "ask" ? $this->ask($message) : $this->secret($message);

        $validator = Validator::make([
            $name => $answer,
        ], [
            $name => $rules,
        ]);

        if ($validator->passes()) {
            return $answer;
        }

        foreach ($validator->errors()->all() as $error) {
            $this->error($error);
        }

        return $this->askWithValidation($message, $rules, $name);
    }
}
