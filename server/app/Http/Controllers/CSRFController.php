<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CSRFController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return csrf_token();
    }
}
