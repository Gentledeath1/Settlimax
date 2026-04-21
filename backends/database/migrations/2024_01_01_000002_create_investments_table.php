<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvestmentsTable extends Migration
{
    public function up(): void
    {
        Schema::create('investments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('tier');
            $table->string('plan_name');
            $table->decimal('amount', 15, 2);
            $table->decimal('daily_income', 15, 2);
            $table->decimal('total_return', 15, 2);
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->unsignedInteger('days_elapsed')->default(0);
            $table->timestamp('last_income_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('investments'); }
}
