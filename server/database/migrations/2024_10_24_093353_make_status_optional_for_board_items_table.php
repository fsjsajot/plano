<?php

use App\Models\Status;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('board_items', function (Blueprint $table) {
            $table->foreignIdFor(Status::class)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('board_items', function (Blueprint $table) {
            $table->foreignIdFor(Status::class)->nullable(false)->change();
        });
    }
};
