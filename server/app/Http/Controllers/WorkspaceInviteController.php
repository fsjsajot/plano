<?php

namespace App\Http\Controllers;

use App\Http\Resources\WorkspaceInviteResource;
use App\Mail\InviteMember;
use App\Models\Workspace;
use App\Models\WorkspaceInvite;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class WorkspaceInviteController extends Controller
{

    public function show(Workspace $workspace, string $token = null)
    {
        $query = WorkspaceInvite::with('workspace.owner')
            ->where('workspace_id', '=', $workspace->id)
            ->whereNull('disabled_at');


        if ($token) {
            $query
                ->where('token', '=', $token);
        }

        $invite = $query->firstOrFail(); // only one shareable invite link allowed

        return new WorkspaceInviteResource($invite);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Workspace $workspace, Request $request)
    {
        $rules = [
            'invite_type' => ['required']
        ];

        $request->validate($rules);

        if ($request->invite_type == 2) {
            $existingInvite = WorkspaceInvite::where('workspace_id', '=', $workspace->id)
                ->where('invite_type', '=', 2)
                ->whereNull('disabled_at')
                ->first();

            if ($existingInvite) {
                return new WorkspaceInviteResource($existingInvite);
            } else {
                $token = Str::random(32);

                $params = [
                    'token' => $token,
                    'workspace_id' => $workspace->id,
                    'invite_type' => $request->invite_type
                ];

                $invite = WorkspaceInvite::create($params);

                return new WorkspaceInviteResource($invite);
            }
        } else {
            $request->validate([
                'emails' => ['array', 'required']
            ]);


            $workspace_owner = $workspace->owner;

            foreach ($request->emails as $email) {
                $token = Str::random(32);

                $params = [
                    'token' => $token,
                    'workspace_id' => $workspace->id,
                    'invite_type' => $request->invite_type,
                    'email' => $email
                ];

                $invite = WorkspaceInvite::create($params);

                $invite_url = config('app.frontend_url') . "/workspaces/{$workspace->id}/invited/{$token}";

                Mail::to($email)->queue(new InviteMember($workspace_owner, $workspace, $invite_url));
                Log::info("Queued workspace invitation email to {$email} for {$workspace->name} workspace.");
            }

            return response()->json(['data' => ['message' => 'Successfully sent email invitations.']]);
        }
    }

    public function acceptInvite(Workspace $workspace, string $token)
    {
        // check if the invite url is still valid
        WorkspaceInvite::where('workspace_id', '=', $workspace->id)
            ->where('token', '=', $token)
            ->firstOrFail();

        $workspace->members()->attach(Auth::user()->id);

        return response()->json(['data' => ['message' => 'Added to workspace.']]);
    }

    public function acceptEmailInvite(Workspace $workspace, string $token, Request $request)
    {
        $email = $request->query('email');

        //return response()->json(['w' => $workspace, 'u' => Auth::user()]);
        $invite = WorkspaceInvite::where('workspace_id', '=', $workspace->id)
            ->where('token', '=', $token)
            ->where('email', '=', $email)
            ->whereNull('disabled_at')
            ->firstOrFail();
        

        $workspace->members()->attach(Auth::user()->id);

        $invite->disabled_at = Carbon::now();
        $invite->save();

        return new WorkspaceInviteResource($invite);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace, WorkspaceInvite $invite)
    {
        $invite->disabled_at = Carbon::now();
        $invite->save();

        return response()->json(['data' => ['message' => "{$invite->id} has been disabled."]]);
    }
}
