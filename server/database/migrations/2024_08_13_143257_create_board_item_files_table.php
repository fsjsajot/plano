<?php

use App\Models\BoardItem;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('board_item_files', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable(false);
            $table->text('path');
            $table->string('type');
            $table->foreignIdFor(BoardItem::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('board_item_files');
    }
};
