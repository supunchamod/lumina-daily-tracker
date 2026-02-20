<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdmin
{
    /**
     * Allow only authenticated users whose is_admin flag is true.
     * Returns 403 JSON for API requests; redirects to '/' for web requests.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! $request->user()->is_admin) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json(
                    ['message' => 'Forbidden. Admin access required.'],
                    Response::HTTP_FORBIDDEN
                );
            }

            return redirect('/');
        }

        return $next($request);
    }
}
