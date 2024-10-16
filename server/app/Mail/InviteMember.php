<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InviteMember extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $app_name;
    public $app_url;

    public $workspace;

    public $invite_url;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, Workspace $workspace, string $invite_url)
    {
        $this->user = $user;
        $this->app_name = config('app.name');
        $this->app_url = config('app.app_url');
        $this->workspace = $workspace;
        $this->invite_url = $invite_url;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "{$this->user->name} invited you to a Workspace",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.invitation',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
